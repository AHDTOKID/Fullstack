import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
      navigate('/feedback');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-container mb-4">
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

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-[0_20px_40px_rgba(13,28,47,0.06)]">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary font-headline">Welcome back</h1>
            <p className="text-secondary text-sm mt-2">Sign in to your academic portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">
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
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">
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
              <p className="text-error text-sm bg-error-container px-4 py-2 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-all mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <span className="material-symbols-outlined text-[20px]">login</span>}
            </button>
          </form>

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
