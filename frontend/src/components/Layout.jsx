import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
  { label: 'Resources', href: '#' },
];

export default function Layout({ children, title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const currentNav = navItems.find(n => location.pathname === n.href);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-3 bg-[#f8f9ff]/80 backdrop-blur-md shadow-[0_4px_24px_rgba(13,28,47,0.07)] font-headline text-sm tracking-tight">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-xl font-bold tracking-tighter text-primary">Academic Atelier</Link>
          <div className="hidden md:flex gap-6 items-center">
            {topNavLinks.map(link => (
              <Link key={link.label} to={link.href}
                className={`transition-colors duration-200 ${location.pathname === link.href ? 'text-primary font-bold border-b-2 border-primary pb-0.5' : 'text-secondary hover:text-primary'}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
            <input className="pl-10 pr-4 py-1.5 rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container text-sm w-56" placeholder="Search portal…" />
          </div>
          <button className="relative">
            <span className="material-symbols-outlined text-secondary">notifications</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full text-white text-[8px] flex items-center justify-center font-bold">3</span>
          </button>
          <button><span className="material-symbols-outlined text-secondary">settings</span></button>

          {/* Profile Button with Dropdown */}
          <div className="relative" ref={dropRef}>
            <button onClick={() => setProfileOpen(v => !v)}
              className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-container">
              {user?.avatarUrl
                ? <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border-2 border-surface-container-high object-cover" />
                : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-xs font-bold">{user?.initials || 'U'}</div>
              }
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_20px_40px_rgba(13,28,47,0.14)] border border-surface-container-low overflow-hidden z-50">
                <div className="px-4 py-3 bg-surface-container-low border-b border-surface-container">
                  <p className="font-bold text-primary text-sm font-headline">{user?.name || 'User'}</p>
                  <p className="text-[11px] text-secondary capitalize">{user?.role || 'Member'} · {user?.title || 'Academic Atelier'}</p>
                </div>
                <div className="py-1">
                  <button onClick={() => { setShowProfileModal(true); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-secondary">person</span>
                    View Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-secondary">settings</span>
                    Account Settings
                  </button>
                  <div className="border-t border-surface-container-low my-1" />
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container transition-colors">
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
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <div>
            <div className="text-base font-black text-primary font-headline leading-tight">The Atelier</div>
            <div className="font-headline font-semibold uppercase tracking-widest text-[9px] text-secondary">Education Portal</div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5">
          {navItems.map(item => {
            const active = location.pathname === item.href;
            return (
              <Link key={item.label} to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-headline font-semibold uppercase tracking-widest text-[10px] transition-all duration-200
                  ${active ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-surface-container-low hover:text-primary hover:translate-x-0.5'}`}>
                <span className="material-symbols-outlined text-[20px]" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 pb-2">
          <button className="w-full py-2.5 px-4 bg-surface-container-high text-on-primary-fixed-variant rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors">
            Support Center
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-secondary hover:text-error transition-colors font-headline font-semibold uppercase tracking-widest text-[10px] w-full rounded-xl hover:bg-error-container/30">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="md:ml-64 pt-20 min-h-screen">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg flex justify-around py-3 z-50 border-t border-surface-container-low">
        {navItems.slice(0, 5).map((item, i) => (
          <Link key={item.href} to={item.href} className={location.pathname === item.href ? 'text-primary' : 'text-secondary'}>
            <span className="material-symbols-outlined" style={location.pathname === item.href ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
          </Link>
        ))}
      </nav>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowProfileModal(false)} />
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-[0_40px_80px_rgba(13,28,47,0.18)] z-10">
            <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 text-secondary hover:text-primary">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex flex-col items-center text-center gap-4">
              {user?.avatarUrl
                ? <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-surface-container-high" />
                : <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-2xl font-bold font-headline">{user?.initials || 'U'}</div>
              }
              <div>
                <h2 className="text-2xl font-bold text-primary font-headline">{user?.name}</h2>
                <p className="text-secondary text-sm mt-1 capitalize">{user?.title || user?.role}</p>
                <p className="text-secondary text-sm">{user?.email}</p>
              </div>
              <div className="w-full grid grid-cols-3 gap-3 mt-2">
                {[['Role', user?.role || '—'], ['Status', 'Active'], ['Portal', 'Atelier']].map(([k, v]) => (
                  <div key={k} className="bg-surface-container-low rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">{k}</p>
                    <p className="font-bold text-primary capitalize text-sm mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowProfileModal(false)}
                className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-all mt-2">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
