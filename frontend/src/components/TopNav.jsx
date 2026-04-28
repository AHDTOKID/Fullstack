export default function TopNav({ user, onLogout }) {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-3 bg-[#f8f9ff]/70 backdrop-blur-md shadow-[0_20px_40px_rgba(13,28,47,0.06)] font-headline text-sm tracking-tight">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tighter text-primary">Academic Atelier</span>
        <div className="hidden md:flex gap-6 items-center">
          <a href="#" className="text-secondary hover:text-primary-container transition-colors duration-200 cursor-pointer">Explore</a>
          <a href="#" className="text-secondary hover:text-primary-container transition-colors duration-200 cursor-pointer">Resources</a>
          <a href="/feedback" className="text-primary font-bold border-b-2 border-primary cursor-pointer">Feedback</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
          <input
            className="pl-10 pr-4 py-1.5 rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container text-sm w-64"
            placeholder="Search exchanges..."
            type="text"
          />
        </div>
        <span className="material-symbols-outlined text-secondary cursor-pointer active:opacity-70">notifications</span>
        <span className="material-symbols-outlined text-secondary cursor-pointer active:opacity-70">settings</span>
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full border border-surface-container-high object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold font-headline">
            {user?.initials || 'U'}
          </div>
        )}
      </div>
    </nav>
  );
}
