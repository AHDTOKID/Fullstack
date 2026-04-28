import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import FeedbackCard from '../components/FeedbackCard';
import StarRating from '../components/StarRating';
import { useAuth } from '../hooks/useAuth';
import api from '../api/client';

const TABS = ['Received', 'Given', 'Drafts'];

export default function FeedbackPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Received');
  const [feedbackList, setFeedbackList] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [recipientId, setRecipientId] = useState('');
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [course, setCourse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data.data.filter(u => u._id !== user?._id))).catch(console.error);
  }, [user]);

  const fetchFeedback = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const endpoints = { Received: `/feedback?page=${page}`, Given: `/feedback/given?page=${page}`, Drafts: '/feedback/drafts' };
      const { data } = await api.get(endpoints[activeTab]);
      setFeedbackList(data.data);
      if (data.pagination) setPagination(data.pagination);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => { fetchFeedback(1); }, [fetchFeedback]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormError(''); setFormSuccess('');
    if (!recipientId || !comment.trim()) { setFormError('Please select a recipient and write a comment.'); return; }
    setSubmitting(true);
    try {
      const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      await api.post('/feedback', { to: recipientId, rating, comment, tags, course });
      setFormSuccess('Feedback submitted successfully!');
      setComment(''); setTagInput(''); setCourse(''); setRating(3);
      if (activeTab === 'Given') fetchFeedback(1);
    } catch (e) { setFormError(e.response?.data?.message || 'Submission failed.'); }
    setSubmitting(false);
  };

  return (
    <Layout>
      <div className="px-8 pb-12 pt-8 max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[12px] uppercase tracking-[0.2em] text-secondary font-bold font-headline">Academic Dialogue</span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary mt-2 font-headline">Feedback Portal</h1>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-surface-container-high text-on-primary-fixed-variant rounded-xl font-semibold hover:bg-surface-container-highest transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">filter_list</span> Filter Views
            </button>
            <button className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">add</span> New Feedback
            </button>
          </div>
        </header>

        <div className="bg-surface-container-low p-1.5 rounded-2xl inline-flex gap-1">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-xl text-sm font-medium transition-all
                ${activeTab === tab ? 'bg-surface-container-lowest shadow-sm text-primary font-bold' : 'text-secondary hover:text-primary'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <section className="lg:col-span-5 bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_40px_rgba(13,28,47,0.06)] sticky top-28">
            <h2 className="text-2xl font-bold text-primary mb-6 font-headline">Create Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Recipient</label>
                <div className="relative">
                  <select value={recipientId} onChange={e => setRecipientId(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 appearance-none focus:ring-2 focus:ring-primary-container text-sm">
                    <option value="">Select recipient…</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name}{u.title ? ` (${u.title})` : ''}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">expand_more</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Performance Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Comments</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4} placeholder="Share your constructive feedback here..."
                  className="w-full bg-surface-container-lowest border-none border-b-2 border-surface-dim focus:border-primary-container focus:ring-0 text-sm py-2 px-0 resize-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Tags (comma-separated)</label>
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="e.g. Architecture, Final Project"
                  className="w-full bg-surface-container-lowest border-none border-b-2 border-surface-dim focus:border-primary-container focus:ring-0 text-sm py-2 px-0" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Course / Context</label>
                <input value={course} onChange={e => setCourse(e.target.value)} placeholder="e.g. Studio IV"
                  className="w-full bg-surface-container-lowest border-none border-b-2 border-surface-dim focus:border-primary-container focus:ring-0 text-sm py-2 px-0" />
              </div>
              {formError && <p className="text-error text-sm bg-error-container px-4 py-2 rounded-xl">{formError}</p>}
              {formSuccess && <p className="text-green-700 text-sm bg-green-50 px-4 py-2 rounded-xl">{formSuccess}</p>}
              <div className="pt-4">
                <button type="submit" disabled={submitting}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-3 disabled:opacity-60">
                  {submitting ? 'Submitting…' : 'Submit Feedback'} <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </form>
          </section>

          <section className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary font-headline">Recent Exchanges</h2>
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">Page {pagination.page} of {pagination.pages || 1}</span>
            </div>
            {loading ? (
              <div className="space-y-6">{[1,2,3].map(i => <div key={i} className="h-48 bg-surface-container animate-pulse rounded-3xl" />)}</div>
            ) : feedbackList.length === 0 ? (
              <div className="text-center py-20 text-secondary">
                <span className="material-symbols-outlined text-5xl block mb-4 opacity-30">rate_review</span>
                <p className="font-headline font-bold text-lg text-primary">No feedback here yet</p>
                <p className="text-sm mt-1">Create your first feedback using the form.</p>
              </div>
            ) : (
              feedbackList.map((fb, i) => <FeedbackCard key={fb._id} feedback={fb} offset={i % 2 === 1} />)
            )}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-3 pt-4">
                <button disabled={pagination.page <= 1} onClick={() => fetchFeedback(pagination.page - 1)}
                  className="px-5 py-2.5 bg-surface-container-high text-on-primary-fixed-variant rounded-xl text-sm font-bold disabled:opacity-40">← Prev</button>
                <button disabled={pagination.page >= pagination.pages} onClick={() => fetchFeedback(pagination.page + 1)}
                  className="px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl text-sm font-bold disabled:opacity-40">Next →</button>
              </div>
            )}
          </section>
        </div>
      </div>

      <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>rate_review</span>
      </button>
    </Layout>
  );
}
