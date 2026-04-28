const navItems = [
  { icon: 'dashboard', label: 'Dashboard', href: '#' },
  { icon: 'analytics', label: 'Academic Records', href: '#' },
  { icon: 'calendar_today', label: 'Timetable', href: '#' },
  { icon: 'payments', label: 'Fee Management', href: '#' },
  { icon: 'group', label: 'Class Management', href: '#' },
  { icon: 'rate_review', label: 'Feedback', href: '/feedback', active: true },
];

export default function SideNav({ onLogout }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col p-6 space-y-8 bg-surface z-40 pt-20 hidden md:flex">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
          <span
            className="material-symbols-outlined text-white"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            school
          </span>
        </div>
        <div>
          <div className="text-lg font-black text-primary font-headline">The Atelier</div>
          <div className="font-headline font-medium uppercase tracking-widest text-[10px] text-secondary">
            Education Portal
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-headline font-medium uppercase tracking-widest text-[10px] transition-all duration-300
              ${
                item.active
                  ? 'bg-surface-container text-primary shadow-sm'
                  : 'text-secondary hover:bg-surface-container-low hover:translate-x-1'
              }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="pt-6 border-t border-surface-container-high space-y-4">
        <button className="w-full py-3 px-4 bg-surface-container-high text-on-primary-fixed-variant rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors">
          Support Center
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 text-secondary hover:text-error transition-colors font-headline font-medium uppercase tracking-widest text-[10px]"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
