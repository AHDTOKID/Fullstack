import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/client';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { icon: 'analytics', label: 'Academic Records', href: '/academic-records' },
  { icon: 'calendar_today', label: 'Timetable', href: '/timetable' },
  { icon: 'payments', label: 'Fee Management', href: '/fees' },
  { icon: 'group', label: 'Class Management', href: '/classes' },
  { icon: 'rate_review', label: 'Feedback', href: '/feedback' },
];

const topNavLinks = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Academic Records', href: '/academic-records' },
  { label: 'Timetable', href: '/timetable' },
  { label: 'Fee Portal', href: '/fees' },
];

const CLASSES_LIST = [
  'Grade 10 - Section A',
  'Grade 10 - Section B',
  'Grade 11 - Section A',
  'Grade 11 - Section B',
  'Grade 12 - Section A',
];

export default function Layout({ children }) {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile'); // 'profile' | 'security' | 'preferences'

  // Settings Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    title: '',
    phone: '',
    studentClass: 'Grade 10 - Section A',
    rollNumber: '',
  });

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference Toggles
  const [notifyGrades, setNotifyGrades] = useState(true);
  const [notifyFees, setNotifyFees] = useState(true);
  const [notifySchedule, setNotifySchedule] = useState(true);

  // Status Messages
  const [saving, setSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState({ type: '', text: '' });

  const dropRef = useRef(null);

  // Sync profile form when user object is loaded or settings modal opens
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        title: user.title || '',
        phone: user.phone || '',
        studentClass: user.studentClass || 'Grade 10 - Section A',
        rollNumber: user.rollNumber || '',
      });
    }
  }, [user, showSettingsModal]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSettingsMsg({ type: '', text: '' });
    try {
      const res = await api.put('/users/me', profileForm);
      if (res.data?.success) {
        updateUser(res.data.data);
        setSettingsMsg({ type: 'success', text: 'Profile changes saved successfully!' });
        setTimeout(() => setSettingsMsg({ type: '', text: '' }), 3500);
      }
    } catch (err) {
      setSettingsMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setSettingsMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setSettingsMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setSettingsMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    setSaving(true);
    try {
      const res = await api.put('/users/password', { currentPassword, newPassword });
      if (res.data?.success) {
        setSettingsMsg({ type: 'success', text: 'Password successfully updated!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSettingsMsg({ type: '', text: '' }), 3500);
      }
    } catch (err) {
      setSettingsMsg({
        type: 'error',
        text: err.response?.data?.message || 'Incorrect current password or update failed.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-3 bg-[#f8f9ff]/80 backdrop-blur-md shadow-[0_4px_24px_rgba(13,28,47,0.07)] font-headline text-sm tracking-tight">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-xl font-bold tracking-tighter text-primary">
            Academic Atelier
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            {topNavLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`transition-colors duration-200 ${
                  location.pathname === link.href
                    ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">
              search
            </span>
            <input
              className="pl-10 pr-4 py-1.5 rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container text-sm w-56"
              placeholder="Search portal…"
            />
          </div>

          <button className="relative p-1 text-secondary hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full text-white text-[8px] flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {/* Settings Gear Button */}
          <button
            onClick={() => setShowSettingsModal(true)}
            title="Account Settings"
            className="p-1 text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>

          {/* Profile Button with Dropdown */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-surface-container-high object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-xs font-bold">
                  {user?.initials || 'U'}
                </div>
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_20px_40px_rgba(13,28,47,0.14)] border border-surface-container-low overflow-hidden z-50">
                <div className="px-4 py-3 bg-surface-container-low border-b border-surface-container">
                  <p className="font-bold text-primary text-sm font-headline truncate">{user?.name || 'User'}</p>
                  <p className="text-[11px] text-secondary capitalize truncate">
                    {user?.role || 'Member'} · {user?.studentClass || user?.title || 'Academic Atelier'}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">person</span>
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowSettingsModal(true);
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">settings</span>
                    Account Settings
                  </button>
                  <div className="border-t border-surface-container-low my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Side Nav */}
      <aside className="fixed left-0 top-0 h-full w-64 flex flex-col p-6 space-y-8 bg-surface z-40 pt-20 hidden md:flex border-r border-surface-container-low/60">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
              school
            </span>
          </div>
          <div>
            <div className="text-base font-black text-primary font-headline leading-tight">The Atelier</div>
            <div className="font-headline font-semibold uppercase tracking-widest text-[9px] text-secondary">
              Education Portal
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-headline font-semibold uppercase tracking-widest text-[10px] transition-all duration-200 ${
                  active
                    ? 'bg-primary text-white shadow-md'
                    : 'text-secondary hover:bg-surface-container-low hover:text-primary hover:translate-x-0.5'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 pb-2">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-full py-2.5 px-4 bg-surface-container-high text-on-primary-fixed-variant rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
            Settings & Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-secondary hover:text-error transition-colors font-headline font-semibold uppercase tracking-widest text-[10px] w-full rounded-xl hover:bg-error-container/30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="md:ml-64 pt-20 min-h-screen">{children}</main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg flex justify-around py-3 z-50 border-t border-surface-container-low">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={location.pathname === item.href ? 'text-primary' : 'text-secondary'}
          >
            <span
              className="material-symbols-outlined"
              style={location.pathname === item.href ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
          </Link>
        ))}
      </nav>

      {/* ================= VIEW PROFILE MODAL ================= */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProfileModal(false)} />
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl z-10 border border-surface-container-low">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-secondary hover:text-primary cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex flex-col items-center text-center gap-4">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-surface-container-high"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-2xl font-bold font-headline">
                  {user?.initials || 'U'}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-primary font-headline">{user?.name}</h2>
                <p className="text-secondary text-sm mt-0.5 capitalize">
                  {user?.role === 'student' ? user?.studentClass : user?.title || user?.role}
                </p>
                <p className="text-secondary text-xs mt-1">{user?.email}</p>
              </div>

              <div className="w-full grid grid-cols-3 gap-2.5 mt-2">
                {[
                  ['Role', user?.role || '—'],
                  ['Class', user?.role === 'student' ? user?.studentClass?.replace('Grade ', '') : 'Faculty'],
                  ['ID', user?.studentId || '#ST-9901'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-surface-container-low rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">{k}</p>
                    <p className="font-bold text-primary capitalize text-xs mt-0.5 truncate">{v}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 w-full mt-2">
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setShowSettingsModal(true);
                  }}
                  className="flex-1 py-2.5 bg-surface-container-high text-primary rounded-xl font-bold text-xs hover:bg-surface-container-highest transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span> Edit Settings
                </button>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ACCOUNT SETTINGS MODAL ================= */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !saving && setShowSettingsModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl z-10 border border-surface-container-low my-8">
            <button
              onClick={() => !saving && setShowSettingsModal(false)}
              className="absolute top-5 right-5 text-secondary hover:text-primary p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  Preferences & Profile
                </span>
              </div>
              <h2 className="text-2xl font-bold text-primary font-headline mt-1">Account Settings</h2>
              <p className="text-secondary text-xs sm:text-sm mt-0.5">
                Manage your credentials, academic enrollment class, and security preferences.
              </p>
            </div>

            {/* Settings Tab Selector */}
            <div className="grid grid-cols-3 gap-1 bg-surface-container-low p-1 rounded-2xl mb-6">
              {[
                { id: 'profile', label: 'Profile & Class', icon: 'person' },
                { id: 'security', label: 'Password & Security', icon: 'lock' },
                { id: 'preferences', label: 'Notifications', icon: 'notifications' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSettingsTab(tab.id);
                    setSettingsMsg({ type: '', text: '' });
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    settingsTab === tab.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Notification / Toast Message */}
            {settingsMsg.text && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2 ${
                  settingsMsg.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {settingsMsg.type === 'success' ? 'check_circle' : 'error'}
                </span>
                {settingsMsg.text}
              </div>
            )}

            {/* TAB 1: PROFILE & CLASS INFORMATION */}
            {settingsTab === 'profile' && (
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-container"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-surface-container border-none rounded-xl py-2.5 px-3 text-sm text-secondary cursor-not-allowed"
                    />
                  </div>
                </div>

                {user?.role === 'student' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                        Assigned Class / Grade
                      </label>
                      <select
                        value={profileForm.studentClass}
                        onChange={(e) => setProfileForm({ ...profileForm, studentClass: e.target.value })}
                        className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-3 text-sm font-semibold focus:ring-2 focus:ring-primary-container"
                      >
                        {CLASSES_LIST.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-secondary mt-1">
                        Changing this updates your timetable schedule and class marks sheet.
                      </p>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                        Student ID
                      </label>
                      <input
                        type="text"
                        disabled
                        value={user?.studentId || '#ST-1001'}
                        className="w-full bg-surface-container border-none rounded-xl py-2.5 px-3 text-sm font-mono text-secondary cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                      {user?.role === 'student' ? 'Roll Number' : 'Academic Title / Role'}
                    </label>
                    <input
                      type="text"
                      value={user?.role === 'student' ? profileForm.rollNumber : profileForm.title}
                      onChange={(e) =>
                        user?.role === 'student'
                          ? setProfileForm({ ...profileForm, rollNumber: e.target.value })
                          : setProfileForm({ ...profileForm, title: e.target.value })
                      }
                      placeholder={user?.role === 'student' ? 'e.g. 007' : 'e.g. Physics Department Lead'}
                      className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-container"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-container"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
                    className="flex-1 py-3 bg-surface-container-high rounded-xl text-sm font-semibold hover:bg-surface-container-highest cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Saving Changes…' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: SECURITY & PASSWORD */}
            {settingsTab === 'security' && (
              <form onSubmit={handlePasswordSave} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-container"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-container"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-container"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
                    className="flex-1 py-3 bg-surface-container-high rounded-xl text-sm font-semibold hover:bg-surface-container-highest cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Updating…' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: NOTIFICATIONS & PREFERENCES */}
            {settingsTab === 'preferences' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {[
                    ['Academic Records & Grade Releases', 'Receive instant notifications when exam scores are published', notifyGrades, setNotifyGrades],
                    ['Fee Reminders & Receipts', 'Alerts for upcoming semester installments and payment receipts', notifyFees, setNotifyFees],
                    ['Schedule & Timetable Alterations', 'Updates when classes or period timings are modified', notifySchedule, setNotifySchedule],
                  ].map(([title, desc, state, setter]) => (
                    <div key={title} className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-2xl">
                      <div>
                        <p className="font-bold text-primary text-xs sm:text-sm">{title}</p>
                        <p className="text-[11px] text-secondary mt-0.5">{desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setter(!state)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          state ? 'bg-primary' : 'bg-surface-container-highest'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            state ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSettingsMsg({ type: 'success', text: 'Notification preferences updated!' });
                      setTimeout(() => setSettingsMsg({ type: '', text: '' }), 2500);
                    }}
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-container transition-all shadow-md cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
