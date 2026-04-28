import { useState } from 'react';
import Layout from '../components/Layout';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'];

const SUBJECT_COLORS = {
  Physics: 'bg-blue-50 text-blue-700 border-blue-200',
  Mathematics: 'bg-purple-50 text-purple-700 border-purple-200',
  Chemistry: 'bg-green-50 text-green-700 border-green-200',
  Literature: 'bg-pink-50 text-pink-700 border-pink-200',
  History: 'bg-orange-50 text-orange-700 border-orange-200',
  'Art & Design': 'bg-teal-50 text-teal-700 border-teal-200',
  Break: 'bg-surface-container text-secondary border-transparent',
  Free: '',
};

const initialTimetable = {
  Monday:    ['Physics',    'Mathematics', 'Break',   'Chemistry',  'Literature', 'Break',  'History',    'Art & Design'],
  Tuesday:   ['Mathematics','Physics',     'Break',   'Literature', 'Chemistry',  'Break',  'Art & Design','History'],
  Wednesday: ['Chemistry',  'History',     'Break',   'Mathematics','Physics',    'Break',  'Literature', 'Free'],
  Thursday:  ['Literature', 'Art & Design','Break',   'Physics',    'Mathematics','Break',  'Chemistry',  'Free'],
  Friday:    ['History',    'Chemistry',   'Break',   'Art & Design','Literature','Break',  'Physics',    'Mathematics'],
  Saturday:  ['Physics',    'Mathematics', 'Free',    'Free',        'Free',      'Free',   'Free',       'Free'],
};

const CLASSES = ['Grade 10 - Section A', 'Grade 10 - Section B', 'Grade 11 - Section A'];
const TERMS = ['Term 1 – 2024', 'Term 2 – 2024', 'Final Examination 2024'];

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedTerm, setSelectedTerm] = useState(TERMS[0]);
  const [timetable, setTimetable] = useState(initialTimetable);
  const [editing, setEditing] = useState(null); // { day, periodIdx }
  const [editValue, setEditValue] = useState('');
  const [saved, setSaved] = useState(false);

  const today = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];

  const startEdit = (day, idx, val) => {
    setEditing({ day, idx }); setEditValue(val);
  };
  const commitEdit = () => {
    if (!editing) return;
    setTimetable(t => ({ ...t, [editing.day]: t[editing.day].map((s, i) => i === editing.idx ? editValue : s) }));
    setEditing(null); setSaved(false);
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <Layout>
      <div className="px-8 pb-12 pt-8 max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-secondary font-bold font-headline">Schedule</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline mt-1">Timetable</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                className="bg-surface-container-low border-none rounded-xl py-2.5 px-4 pr-8 appearance-none text-sm font-semibold focus:ring-2 focus:ring-primary-container">
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-secondary text-[18px]">expand_more</span>
            </div>
            <div className="relative">
              <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)}
                className="bg-surface-container-low border-none rounded-xl py-2.5 px-4 pr-8 appearance-none text-sm font-semibold focus:ring-2 focus:ring-primary-container">
                {TERMS.map(t => <option key={t}>{t}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-secondary text-[18px]">expand_more</span>
            </div>
            <button onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2">
              {saved ? <><span className="material-symbols-outlined text-[18px]">check</span> Saved</> : <><span className="material-symbols-outlined text-[18px]">save</span> Save Changes</>}
            </button>
          </div>
        </header>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(SUBJECT_COLORS).filter(([k]) => k !== 'Free' && k !== 'Break').map(([subj, cls]) => (
            <span key={subj} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${cls}`}>{subj}</span>
          ))}
        </div>

        {/* Grid */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_24px_rgba(13,28,47,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-secondary w-28">Period</th>
                  {DAYS.map(day => (
                    <th key={day} className={`px-4 py-4 text-center text-[11px] uppercase tracking-widest font-bold ${day === today ? 'text-primary' : 'text-secondary'}`}>
                      {day === today ? <span className="inline-flex items-center gap-1">{day} <span className="w-1.5 h-1.5 rounded-full bg-primary" /></span> : day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((period, pIdx) => (
                  <tr key={period} className="border-t border-surface-container-low/60">
                    <td className="px-5 py-3 text-xs font-bold text-secondary whitespace-nowrap">{period}</td>
                    {DAYS.map(day => {
                      const subj = timetable[day]?.[pIdx] || 'Free';
                      const isEditing = editing?.day === day && editing?.idx === pIdx;
                      const colorCls = SUBJECT_COLORS[subj] || '';
                      return (
                        <td key={day} className={`px-2 py-2 text-center ${day === today ? 'bg-surface-container-low/30' : ''}`}>
                          {isEditing ? (
                            <input autoFocus value={editValue} onChange={e => setEditValue(e.target.value)}
                              onBlur={commitEdit} onKeyDown={e => e.key === 'Enter' && commitEdit()}
                              className="w-full text-center text-xs border-2 border-primary rounded-lg py-1.5 px-2 focus:outline-none" />
                          ) : subj === 'Free' ? (
                            <button onClick={() => startEdit(day, pIdx, '')}
                              className="w-full py-2 text-xs text-secondary/30 hover:text-secondary hover:bg-surface-container-low rounded-xl transition-colors">—</button>
                          ) : (
                            <button onClick={() => startEdit(day, pIdx, subj)}
                              className={`w-full py-2 px-2 text-[11px] font-bold rounded-xl border transition-all hover:shadow-sm ${colorCls}`}>
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
        </div>

        <p className="text-xs text-secondary text-center">Click any cell to edit · Press Enter or click away to save</p>
      </div>
    </Layout>
  );
}
