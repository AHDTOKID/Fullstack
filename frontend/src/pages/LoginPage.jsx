import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const DEMO_ACCOUNTS = [
  { label: 'Alex Thompson (Grade 10-A Student)', email: 'alex@school.edu', pass: 'password123', role: 'student', badge: '10-A' },
  { label: 'Priya Nair (Grade 10-B Student)', email: 'priya@school.edu', pass: 'password123', role: 'student', badge: '10-B' },
  { label: 'Sasha Petrov (Grade 11-A Student)', email: 'sasha@school.edu', pass: 'password123', role: 'student', badge: '11-A' },
  { label: 'Dr. Julian Thorne (Faculty)', email: 'faculty@school.edu', pass: 'password123', role: 'faculty', badge: 'Faculty' },
  { label: 'Eleanor Vance (Admin)', email: 'admin@school.edu', pass: 'password123', role: 'admin', badge: 'Admin' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
    setLoading(false);
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-container mb-3 shadow-md">
            <span
              className="material-symbols-outlined text-white text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              school
            </span>
          </div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-secondary font-bold font-headline">
            Academic Atelier
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-[0_20px_40px_rgba(13,28,47,0.06)] border border-surface-container-low">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary font-headline">Welcome back</h1>
            <p className="text-secondary text-sm mt-1.5">Sign in to your academic portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-container"
                placeholder="you@university.edu"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-container"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-error text-sm bg-error-container px-4 py-2.5 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-all mt-2 disabled:opacity-60 flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <span className="material-symbols-outlined text-[20px]">login</span>}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-6 border-t border-surface-container-low">
            <p className="text-[10px] uppercase tracking-widest font-bold text-secondary text-center mb-3">
              Quick One-Click Demo Accounts
            </p>
            <div className="flex flex-col gap-1.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-left text-xs"
                >
                  <span className="font-semibold text-primary">{acc.label}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary-container text-white">
                    {acc.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-secondary">
            No account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
