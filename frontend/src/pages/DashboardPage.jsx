import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

const stats = [
  { label: 'Total Students', value: '1,248', icon: 'group', change: '+12 this month', color: 'bg-primary text-white' },
  { label: 'Active Classes', value: '34', icon: 'class', change: '6 new this term', color: 'bg-surface-container-highest text-primary' },
  { label: 'Pending Fees', value: '₹2.4L', icon: 'payments', change: '18 overdue', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  { label: 'Avg. Score', value: '81.4%', icon: 'analytics', change: '+3.2% vs last term', color: 'bg-secondary-container text-primary' },
];

const recentActivity = [
  { icon: 'rate_review', text: 'Dr. Julian Thorne submitted feedback for Studio IV', time: '2m ago', color: 'text-primary' },
  { icon: 'payments', text: 'Fee payment received from Alex Thompson (#AT-9920)', time: '18m ago', color: 'text-green-600' },
  { icon: 'warning', text: 'Marcus Chen marked absent — medical leave pending', time: '1h ago', color: 'text-error' },
  { icon: 'analytics', text: 'Grade 10-A marks submitted for Theoretical Physics', time: '2h ago', color: 'text-secondary' },
  { icon: 'person_add', text: 'New student Sasha Petrov enrolled in Grade 10-B', time: '3h ago', color: 'text-primary' },
];

const quickLinks = [
  { label: 'Academic Records', icon: 'analytics', href: '/academic-records', desc: 'Upload & manage marks' },
  { label: 'Timetable', icon: 'calendar_today', href: '/timetable', desc: 'View & edit schedules' },
  { label: 'Fee Management', icon: 'payments', href: '/fees', desc: 'Track payments & dues' },
  { label: 'Class Management', icon: 'group', href: '/classes', desc: 'Manage classes & students' },
  { label: 'Feedback', icon: 'rate_review', href: '/feedback', desc: 'View academic dialogue' },
];

const upcomingEvents = [
  { date: 'Apr 20', day: 'Mon', title: 'Final Examination 2024 Begins', type: 'exam', color: 'bg-error-container text-error' },
  { date: 'Apr 22', day: 'Wed', title: 'Fee Submission Deadline', type: 'fee', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  { date: 'Apr 25', day: 'Sat', title: 'Parent-Teacher Conference', type: 'event', color: 'bg-secondary-container text-primary' },
  { date: 'May 1', day: 'Thu', title: 'New Term Registration Opens', type: 'admin', color: 'bg-surface-container-highest text-primary' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout>
      <div className="px-8 pb-12 pt-8 max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-secondary font-bold font-headline">Overview</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline mt-1">
              {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-secondary text-sm mt-2">Here's what's happening in your academic portal today.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary bg-surface-container-low px-4 py-2 rounded-xl">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-3xl p-6 ${s.color} shadow-sm`}>
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-[28px] opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              </div>
              <p className="text-3xl font-black font-headline">{s.value}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-70 mt-1">{s.label}</p>
              <p className="text-xs opacity-60 mt-1">{s.change}</p>
            </div>
          ))}
        </div>

        {/* Main 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Quick Navigation */}
          <div className="lg:col-span-1 bg-surface-container-lowest rounded-3xl p-6 shadow-[0_4px_24px_rgba(13,28,47,0.06)]">
            <h2 className="text-lg font-bold text-primary font-headline mb-5">Quick Access</h2>
            <div className="space-y-2">
              {quickLinks.map(link => (
                <Link key={link.href} to={link.href}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-[20px] text-primary group-hover:text-white">{link.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm font-headline">{link.label}</p>
                    <p className="text-[11px] text-secondary">{link.desc}</p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-secondary ml-auto opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl p-6 shadow-[0_4px_24px_rgba(13,28,47,0.06)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-primary font-headline">Recent Activity</h2>
              <button className="text-[10px] uppercase tracking-widest font-bold text-secondary hover:text-primary transition-colors">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className={`material-symbols-outlined text-[18px] ${a.color}`}>{a.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface">{a.text}</p>
                    <p className="text-[11px] text-secondary mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_4px_24px_rgba(13,28,47,0.06)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-primary font-headline">Upcoming Events</h2>
            <button className="text-[10px] uppercase tracking-widest font-bold text-secondary hover:text-primary transition-colors">Full Calendar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingEvents.map((e, i) => (
              <div key={i} className="rounded-2xl border border-surface-container-high p-4 hover:border-primary/20 transition-colors">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${e.color} mb-3`}>
                  {e.type}
                </div>
                <p className="font-bold text-primary text-sm font-headline leading-snug">{e.title}</p>
                <p className="text-secondary text-xs mt-2 font-bold">{e.date} · {e.day}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Overview Chart (visual-only) */}
        <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-widest opacity-60 font-headline font-bold">Performance</p>
              <h2 className="text-2xl font-bold font-headline mt-1">Term Overview 2024</h2>
            </div>
            <div className="flex gap-3">
              {['All Subjects', 'Grade 10', 'Grade 11'].map(f => (
                <button key={f} className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-xl bg-white/10 hover:bg-white/20 transition-colors first:bg-white/25">{f}</button>
              ))}
            </div>
          </div>
          {/* Bar chart visual */}
          <div className="flex items-end gap-3 h-32">
            {[72, 85, 78, 91, 65, 88, 82, 95, 76, 89, 84, 70].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg bg-white/30 hover:bg-white/50 transition-colors" style={{ height: `${v}%` }} title={`${v}%`} />
                <span className="text-[9px] opacity-50">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
