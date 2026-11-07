import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import api from '../api/client';

const quickLinks = [
  { label: 'Academic Records', icon: 'analytics', href: '/academic-records', desc: 'Upload & manage marks' },
  { label: 'Timetable', icon: 'calendar_today', href: '/timetable', desc: 'View & edit schedules' },
  { label: 'Fee Management', icon: 'payments', href: '/fees', desc: 'Pay fees & track dues' },
  { label: 'Class Management', icon: 'group', href: '/classes', desc: 'Manage classes & students' },
  { label: 'Feedback', icon: 'rate_review', href: '/feedback', desc: 'View academic dialogue' },
];

const upcomingEvents = [
  { date: 'Apr 20', day: 'Mon', title: 'Final Examination 2024 Begins', type: 'exam', color: 'bg-red-50 text-red-700' },
  { date: 'Apr 22', day: 'Wed', title: 'Fee Submission Deadline', type: 'fee', color: 'bg-amber-50 text-amber-800' },
  { date: 'Apr 25', day: 'Sat', title: 'Parent-Teacher Conference', type: 'event', color: 'bg-blue-50 text-blue-700' },
  { date: 'May 1', day: 'Thu', title: 'New Term Registration Opens', type: 'admin', color: 'bg-surface-container-highest text-primary' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  const [feeSummary, setFeeSummary] = useState(null);
  const [classCount, setClassCount] = useState(5);
  const [feedbackCount, setFeedbackCount] = useState(2);

  useEffect(() => {
    // Fetch fee stats or student fee
    api.get('/fees').then((res) => {
      if (res.data?.success) {
        if (isStudent && res.data.data?.[0]) {
          setFeeSummary(res.data.data[0]);
        } else if (res.data.stats) {
          setFeeSummary(res.data.stats);
        }
      }
    }).catch(() => {});

    // Fetch classes
    api.get('/classes').then((res) => {
      if (res.data?.success && res.data.data) {
        setClassCount(res.data.data.length);
      }
    }).catch(() => {});

    // Fetch feedback
    api.get('/feedback').then((res) => {
      if (res.data?.success && res.data.data) {
        setFeedbackCount(res.data.pagination?.total || res.data.data.length);
      }
    }).catch(() => {});
  }, [isStudent]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const stats = [
    {
      label: isStudent ? 'Enrolled Class' : 'Active Classes',
      value: isStudent ? (user?.studentClass?.replace(' - Section ', '-') || 'Grade 10-A') : classCount,
      icon: 'class',
      change: isStudent ? `Roll #${user?.rollNumber || '001'}` : 'All departments active',
      color: 'bg-primary text-white',
    },
    {
      label: isStudent ? 'Fee Due Status' : 'Outstanding Dues',
      value: isStudent
        ? (feeSummary ? `₹${(feeSummary.due || 0).toLocaleString('en-IN')}` : '₹0')
        : (feeSummary ? `₹${((feeSummary.totalPending || 0) / 100000).toFixed(1)}L` : '₹2.4L'),
      icon: 'payments',
      change: isStudent
        ? (feeSummary?.due === 0 ? '✓ Fully Cleared' : 'Payment due')
        : `${feeSummary?.overdueCount || 1} overdue`,
      color: 'bg-amber-50 text-amber-800 border border-amber-200',
    },
    {
      label: isStudent ? 'Student ID' : 'Total Students',
      value: isStudent ? (user?.studentId || '#ST-1001') : '1,248',
      icon: isStudent ? 'badge' : 'group',
      change: isStudent ? 'Verified Portal Access' : '+12 this month',
      color: 'bg-surface-container-highest text-primary',
    },
    {
      label: 'Exchanges & Feedback',
      value: feedbackCount,
      icon: 'rate_review',
      change: 'Constructive dialogue',
      color: 'bg-blue-50 text-blue-700 border border-blue-200',
    },
  ];

  return (
    <Layout>
      <div className="px-6 md:px-8 pb-12 pt-8 max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-secondary font-bold font-headline">Overview</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline mt-1">
              {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-secondary text-sm mt-2">
              {isStudent
                ? `Welcome to your academic atelier dashboard. Check your timetable, grades, and fee payments.`
                : `Here's what's happening in your academic management portal today.`}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </header>

        {/* Personalized Student Action Callout */}
        {isStudent && (
          <div className="bg-gradient-to-r from-primary to-primary-container text-white rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
            <div className="space-y-1">
              <span className="px-3 py-1 bg-white/15 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary-fixed">
                Student Profile Active
              </span>
              <h2 className="text-2xl font-bold font-headline mt-2">
                Class: {user?.studentClass || 'Grade 10 - Section A'}
              </h2>
              <p className="text-sm text-white/80">
                Your timetable has been synchronized to your class curriculum. View your daily schedule and pay any outstanding dues online.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/timetable"
                className="px-5 py-2.5 bg-white text-primary rounded-xl font-bold text-sm hover:bg-white/90 transition-all flex items-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">schedule</span> View My Timetable
              </Link>
              <Link
                to="/fees"
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">payments</span> Pay Fees Online
              </Link>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-3xl p-6 ${s.color} shadow-sm transition-all hover:scale-[1.01]`}>
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-[28px] opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {s.icon}
                </span>
              </div>
              <p className="text-3xl font-black font-headline">{s.value}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mt-1">{s.label}</p>
              <p className="text-xs opacity-75 mt-1 font-medium">{s.change}</p>
            </div>
          ))}
        </div>

        {/* Main 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Navigation */}
          <div className="lg:col-span-1 bg-surface-container-lowest rounded-3xl p-6 shadow-[0_4px_24px_rgba(13,28,47,0.06)] border border-surface-container-low">
            <h2 className="text-lg font-bold text-primary font-headline mb-5">Quick Access</h2>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px] text-primary group-hover:text-white">
                      {link.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm font-headline">{link.label}</p>
                    <p className="text-[11px] text-secondary">{link.desc}</p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-secondary ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    arrow_forward
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl p-6 shadow-[0_4px_24px_rgba(13,28,47,0.06)] border border-surface-container-low">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-primary font-headline">Recent Academic Updates</h2>
              <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">Live Synced</span>
            </div>
            <div className="space-y-3">
              {[
                { icon: 'verified', text: 'Payment system activated with instant receipt generation and card/UPI gateways', time: 'Just now', color: 'text-emerald-600' },
                { icon: 'calendar_today', text: 'Distinct class timetables configured across Grade 10-A, 10-B, 11-A, 11-B & 12-A', time: '5m ago', color: 'text-primary' },
                { icon: 'rate_review', text: 'Dr. Julian Thorne submitted feedback for Studio IV Physics', time: '18m ago', color: 'text-blue-600' },
                { icon: 'payments', text: 'Semester fee portal opened for online installment payments', time: '1h ago', color: 'text-emerald-600' },
                { icon: 'group', text: 'Enrolled students updated in active rosters and timetable schedules', time: '2h ago', color: 'text-secondary' },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-surface-container-low/50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className={`material-symbols-outlined text-[18px] ${a.color}`}>{a.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface font-medium">{a.text}</p>
                    <p className="text-[11px] text-secondary mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_4px_24px_rgba(13,28,47,0.06)] border border-surface-container-low">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-primary font-headline">Upcoming Events & Deadlines</h2>
            <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">Academic Calendar</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingEvents.map((e, i) => (
              <div key={i} className="rounded-2xl border border-surface-container p-4 hover:border-primary/30 transition-colors">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${e.color} mb-3`}>
                  {e.type}
                </div>
                <p className="font-bold text-primary text-sm font-headline leading-snug">{e.title}</p>
                <p className="text-secondary text-xs mt-2 font-bold">{e.date} · {e.day}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
