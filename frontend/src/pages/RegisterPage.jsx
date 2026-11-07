import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const CLASSES = [
  'Grade 10 - Section A',
  'Grade 10 - Section B',
  'Grade 11 - Section A',
  'Grade 11 - Section B',
  'Grade 12 - Section A',
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    title: '',
    studentClass: CLASSES[0],
    rollNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
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
            <h1 className="text-3xl sm:text-4xl font-bold text-primary font-headline">Create Account</h1>
            <p className="text-secondary text-sm mt-1.5">Join the academic portal today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-container"
                placeholder="e.g. Alex Thompson"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-container"
                placeholder="you@school.edu"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1.5">
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
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1.5">
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

            {form.role === 'student' && (
              <>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1.5">
                    Assigned Class / Grade
                  </label>
                  <div className="relative">
                    <select
                      value={form.studentClass}
                      onChange={set('studentClass')}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 appearance-none text-sm focus:ring-2 focus:ring-primary-container"
                    >
                      {CLASSES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                      expand_more
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary mt-1">
                    Your timetable and course schedule will automatically match this class.
                  </p>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1.5">
                    Roll Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.rollNumber}
                    onChange={set('rollNumber')}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-container"
                    placeholder="e.g. 012"
                  />
                </div>
              </>
            )}

            {form.role !== 'student' && (
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1.5">
                  Academic Title / Department
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={set('title')}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-container"
                  placeholder="e.g. Studio IV Lead / Physics Department"
                />
              </div>
            )}

            {error && (
              <p className="text-error text-sm bg-error-container px-4 py-2.5 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-all mt-2 disabled:opacity-60 flex items-center justify-center gap-2 shadow-md cursor-pointer"
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
