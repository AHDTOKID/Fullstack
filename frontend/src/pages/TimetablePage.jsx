import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import api from '../api/client';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'];

const SUBJECT_COLORS = {
  Physics: 'bg-blue-50 text-blue-700 border-blue-200',
  'Theoretical Physics': 'bg-blue-50 text-blue-700 border-blue-200',
  'Physics Lab': 'bg-sky-50 text-sky-700 border-sky-200',
  Mathematics: 'bg-purple-50 text-purple-700 border-purple-200',
  'Advanced Mathematics': 'bg-purple-50 text-purple-700 border-purple-200',
  'Applied Math': 'bg-purple-50 text-purple-700 border-purple-200',
  Chemistry: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Biology: 'bg-teal-50 text-teal-700 border-teal-200',
  'Computer Science': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Literature: 'bg-pink-50 text-pink-700 border-pink-200',
  'English Literature': 'bg-pink-50 text-pink-700 border-pink-200',
  History: 'bg-amber-50 text-amber-700 border-amber-200',
  Geography: 'bg-lime-50 text-lime-700 border-lime-200',
  'Art & Design': 'bg-rose-50 text-rose-700 border-rose-200',
  Economics: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Business Studies': 'bg-violet-50 text-violet-700 border-violet-200',
  Accountancy: 'bg-slate-100 text-slate-700 border-slate-300',
  'Physical Ed': 'bg-orange-50 text-orange-700 border-orange-200',
  Break: 'bg-surface-container text-secondary border-transparent',
  Free: '',
};

export default function TimetablePage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const studentAssignedClass = user?.studentClass || 'Grade 10 - Section A';

  const [classesList, setClassesList] = useState(['Grade 10 - Section A', 'Grade 10 - Section B', 'Grade 11 - Section A', 'Grade 11 - Section B', 'Grade 12 - Section A']);
  const [termsList, setTermsList] = useState(['Term 1 – 2024', 'Term 2 – 2024', 'Final Examination 2024']);
  const [selectedClass, setSelectedClass] = useState(studentAssignedClass);
  const [selectedTerm, setSelectedTerm] = useState('Term 1 – 2024');
  const [timetable, setTimetable] = useState(null);
  const [room, setRoom] = useState('');
  const [classTeacher, setClassTeacher] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // { day, pIdx }
  const [editValue, setEditValue] = useState('');
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

  // Fetch timetable whenever selectedClass or selectedTerm changes
  const fetchTimetable = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/timetable?className=${encodeURIComponent(selectedClass)}&term=${encodeURIComponent(selectedTerm)}`);
      if (res.data?.success && res.data.data) {
        setTimetable(res.data.data.schedule || {});
        setRoom(res.data.data.room || '');
        setClassTeacher(res.data.data.classTeacher || '');
        if (res.data.classes) setClassesList(res.data.classes);
        if (res.data.terms) setTermsList(res.data.terms);
      }
    } catch (err) {
      console.error('Failed to load timetable:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedTerm]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  const startEdit = (day, idx, val) => {
    if (isStudent) return; // Students cannot edit
    setEditing({ day, idx });
    setEditValue(val);
  };

  const commitEdit = () => {
    if (!editing) return;
    setTimetable((t) => ({
      ...t,
      [editing.day]: (t[editing.day] || []).map((s, i) => (i === editing.idx ? editValue : s)),
    }));
    setEditing(null);
  };

  const handleSave = async () => {
    if (isStudent) return;
    try {
      await api.put('/timetable', {
        className: selectedClass,
        term: selectedTerm,
        schedule: timetable,
        room,
        classTeacher,
      });
      setSaved(true);
      setSaveMessage('Timetable updated and persisted to database!');
      setTimeout(() => {
        setSaved(false);
        setSaveMessage('');
      }, 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save timetable changes.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isMyClass = selectedClass === studentAssignedClass;

  return (
    <Layout>
      <div className="px-6 md:px-8 pb-12 pt-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-secondary font-bold font-headline">Schedule</span>
              {isStudent && (
                <span className="bg-primary-container text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full">
                  Personalized Student View
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline mt-1">
              Class Timetable
            </h1>
            <p className="text-secondary text-sm mt-1">
              {isStudent
                ? `Viewing timetable for ${user.name} (${user.studentId || 'ID: Active'}) · Assigned: ${studentAssignedClass}`
                : 'Manage and customize weekly period allocations across all classes and streams.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Class Selector */}
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-surface-container-low border-none rounded-xl py-2.5 pl-4 pr-10 appearance-none text-sm font-semibold focus:ring-2 focus:ring-primary-container cursor-pointer shadow-sm"
              >
                {classesList.map((c) => (
                  <option key={c} value={c}>
                    {c} {isStudent && c === studentAssignedClass ? '★ (My Class)' : ''}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-secondary text-[18px]">
                expand_more
              </span>
            </div>

            {/* Term Selector */}
            <div className="relative">
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="bg-surface-container-low border-none rounded-xl py-2.5 pl-4 pr-10 appearance-none text-sm font-semibold focus:ring-2 focus:ring-primary-container cursor-pointer shadow-sm"
              >
                {termsList.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-secondary text-[18px]">
                expand_more
              </span>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-surface-container-high text-on-primary-fixed-variant rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="Print Timetable"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              Print
            </button>

            {/* Save Button for Faculty/Admin */}
            {!isStudent && (
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                {saved ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] text-green-300">check_circle</span> Saved
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">save</span> Save Changes
                  </>
                )}
              </button>
            )}
          </div>
        </header>

        {/* Status Banners */}
        {isStudent && (
          <div className="bg-gradient-to-r from-primary to-primary-container text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  school
                </span>
              </div>
              <div>
                <p className="font-bold text-base">
                  {isMyClass ? `Your Official Schedule: ${selectedClass}` : `Viewing Class: ${selectedClass}`}
                </p>
                <p className="text-xs opacity-80 mt-0.5">
                  Student: {user.name} · Room: {room || 'Assigned Hall'} · Class Teacher: {classTeacher || 'Faculty'}
                </p>
              </div>
            </div>
            {!isMyClass && (
              <button
                onClick={() => setSelectedClass(studentAssignedClass)}
                className="px-4 py-2 bg-white text-primary font-bold text-xs rounded-xl hover:bg-white/90 transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                Switch Back to My Class ({studentAssignedClass})
              </button>
            )}
          </div>
        )}

        {saveMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-3 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
            {saveMessage}
          </div>
        )}

        {/* Subject Legend */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-secondary">Course Subjects & Tracks</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SUBJECT_COLORS)
              .filter(([k]) => k !== 'Free' && k !== 'Break')
              .map(([subj, cls]) => (
                <span key={subj} className={`px-3 py-1 rounded-full text-[11px] font-bold border ${cls}`}>
                  {subj}
                </span>
              ))}
          </div>
        </div>

        {/* Timetable Table Grid */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_24px_rgba(13,28,47,0.06)] overflow-hidden border border-surface-container-low">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="text-secondary text-sm font-semibold">Loading class schedule…</p>
            </div>
          ) : !timetable ? (
            <div className="p-16 text-center text-secondary">
              <p className="font-bold text-primary">No timetable available for this selection.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container">
                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-secondary w-28">
                      Period / Time
                    </th>
                    {DAYS.map((day) => {
                      const isCurrentDay = day === today;
                      return (
                        <th
                          key={day}
                          className={`px-4 py-4 text-center text-[11px] uppercase tracking-widest font-bold transition-colors ${
                            isCurrentDay ? 'text-primary bg-primary/5' : 'text-secondary'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <span>{day}</span>
                            {isCurrentDay && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" title="Today" />}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {PERIODS.map((period, pIdx) => (
                    <tr
                      key={period}
                      className="border-t border-surface-container-low/60 hover:bg-surface-container-low/20 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-xs font-bold text-secondary whitespace-nowrap bg-surface-container-low/30">
                        {period}
                      </td>
                      {DAYS.map((day) => {
                        const subj = timetable[day]?.[pIdx] || 'Free';
                        const isEditing = editing?.day === day && editing?.idx === pIdx;
                        const isCurrentDay = day === today;
                        const colorCls = SUBJECT_COLORS[subj] || 'bg-surface-container-low text-primary border-surface-container';

                        return (
                          <td
                            key={day}
                            className={`px-2.5 py-2.5 text-center transition-colors ${
                              isCurrentDay ? 'bg-primary/[0.02]' : ''
                            }`}
                          >
                            {isEditing ? (
                              <input
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={commitEdit}
                                onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
                                className="w-full text-center text-xs border-2 border-primary rounded-xl py-2 px-2 focus:outline-none shadow-sm font-semibold"
                              />
                            ) : subj === 'Free' ? (
                              !isStudent ? (
                                <button
                                  onClick={() => startEdit(day, pIdx, '')}
                                  className="w-full py-2.5 text-xs text-secondary/40 hover:text-secondary hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer"
                                  title="Click to add subject"
                                >
                                  —
                                </button>
                              ) : (
                                <span className="text-secondary/30 text-xs">—</span>
                              )
                            ) : subj === 'Break' ? (
                              <div className="w-full py-2 px-2 text-[10px] font-bold uppercase tracking-wider rounded-xl bg-surface-container text-secondary/70">
                                Break
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => startEdit(day, pIdx, subj)}
                                disabled={isStudent}
                                className={`w-full py-2.5 px-2.5 text-[11px] font-bold rounded-xl border transition-all ${
                                  !isStudent ? 'hover:scale-[1.02] cursor-pointer hover:shadow-sm' : 'cursor-default'
                                } ${colorCls}`}
                              >
                                {subj}
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Guidance */}
        {!isStudent ? (
          <p className="text-xs text-secondary text-center">
            💡 Faculty / Admin View: Click any cell to edit subject name · Press Enter or click outside to stage change · Click &quot;Save Changes&quot; to persist to database.
          </p>
        ) : (
          <p className="text-xs text-secondary text-center">
            💡 Student View: Timetable is customized to your class curriculum. Check back regularly for updates.
          </p>
        )}
      </div>
    </Layout>
  );
}
