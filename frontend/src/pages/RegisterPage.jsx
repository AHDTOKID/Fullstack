import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    title: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      navigate('/feedback');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            <h1 className="text-4xl font-bold text-primary font-headline">Create Account</h1>
            <p className="text-secondary text-sm mt-2">Join the academic portal today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-container"
                placeholder="Dr. Jane Smith"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
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
                value={form.password}
                onChange={set('password')}
                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-container"
                placeholder="Min. 6 characters"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">
                Title / Role Description
              </label>
              <input
                type="text"
                value={form.title}
                onChange={set('title')}
                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-container"
                placeholder="e.g. Studio IV Lead (optional)"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">
                Account Role
              </label>
              <div className="relative">
                <select
                  value={form.role}
                  onChange={set('role')}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 appearance-none text-sm focus:ring-2 focus:ring-primary-container"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                  expand_more
                </span>
              </div>
            </div>

            {error && (
              <p className="text-error text-sm bg-error-container px-4 py-2 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-all mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Account…' : 'Create Account'}
              {!loading && <span className="material-symbols-outlined text-[20px]">person_add</span>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
