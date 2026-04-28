import { useState } from 'react';
import Layout from '../components/Layout';

const CLASSES = ['Grade 10 - Section A', 'Grade 10 - Section B', 'Grade 11 - Section A', 'Grade 11 - Section B'];
const SUBJECTS = ['Theoretical Physics', 'Advanced Mathematics', 'Literature & Composition', 'Chemistry', 'History of Art'];

const initialStudents = [
  { roll: '001', name: 'Alex Thompson', studentId: '#AT-9920', avatar: 'AT', status: 'present', marks: '94.5', remarks: 'Outstanding performance' },
  { roll: '002', name: 'Elena Rodriguez', studentId: '#ER-9921', avatar: 'ER', status: 'present', marks: '88.0', remarks: 'Improved logic' },
  { roll: '003', name: 'Marcus Chen', studentId: '#MC-9922', avatar: 'MC', status: 'absent', marks: '105', remarks: 'Medical leave pending' },
  { roll: '004', name: 'Sasha Petrov', studentId: '#SP-9923', avatar: 'SP', status: 'present', marks: '76.0', remarks: 'Consistent effort' },
  { roll: '005', name: 'Priya Nair', studentId: '#PN-9924', avatar: 'PN', status: 'present', marks: '91.0', remarks: 'Excellent grasp of concepts' },
  { roll: '006', name: 'James Wu', studentId: '#JW-9925', avatar: 'JW', status: 'present', marks: '68.5', remarks: 'Needs more practice' },
];

const avatarColors = {
  AT: 'bg-blue-100 text-blue-700', ER: 'bg-pink-100 text-pink-700',
  MC: 'bg-gray-100 text-gray-700', SP: 'bg-green-100 text-green-700',
  PN: 'bg-purple-100 text-purple-700', JW: 'bg-orange-100 text-orange-700',
};

export default function AcademicRecordsPage() {
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [maxMarks, setMaxMarks] = useState(100);
  const [students, setStudents] = useState(initialStudents);
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const updateStudent = (roll, field, value) => {
    setStudents(s => s.map(st => st.roll === roll ? { ...st, [field]: value } : st));
    setSaved(false);
  };

  const isInvalid = (marks) => {
    const n = parseFloat(marks);
    return isNaN(n) || n < 0 || n > maxMarks;
  };

  const errors = students.filter(s => s.status !== 'absent' && isInvalid(s.marks));
  const entered = students.filter(s => s.marks !== '' && !isInvalid(s.marks)).length;

  const handleSaveDraft = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSubmit = () => {
    if (errors.length > 0) return alert('Please fix errors before submitting.');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleDownloadTemplate = () => {
    const csv = ['Roll,Student Name,Student ID,Status,Marks,Remarks', ...students.map(s =>
      `${s.roll},${s.name},${s.studentId},${s.status},,`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'marks_template.csv'; a.click();
  };

  return (
    <Layout>
      <div className="px-8 pb-12 pt-8 max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header>
          <p className="text-[11px] uppercase tracking-[0.2em] text-secondary font-bold font-headline">Curated Authority</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline mt-1">Marks Upload & Entry</h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-secondary">
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">history</span> Last updated: 2 hours ago</span>
            <span className="w-1 h-1 rounded-full bg-secondary/40" />
            <span>Term: Final Examination 2024</span>
          </div>
        </header>

        {/* Controls Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl p-6 shadow-[0_4px_24px_rgba(13,28,47,0.06)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">Select Class</label>
                <div className="relative">
                  <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 appearance-none focus:ring-2 focus:ring-primary-container text-sm">
                    {CLASSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">expand_more</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">Select Subject</label>
                <div className="relative">
                  <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 appearance-none focus:ring-2 focus:ring-primary-container text-sm">
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">expand_more</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">Max Marks</label>
                <input type="number" value={maxMarks} onChange={e => setMaxMarks(Number(e.target.value))}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-container text-sm" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-secondary">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Auto-saving active
              </div>
              <button onClick={handleDownloadTemplate}
                className="px-5 py-2.5 bg-surface-container-high text-on-primary-fixed-variant rounded-xl font-semibold text-sm hover:bg-surface-container-highest transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Download Template
              </button>
              <button onClick={() => setShowUploadModal(true)}
                className="px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                Bulk Upload CSV
              </button>
            </div>
          </div>

          {/* Validation Card */}
          <div className="bg-primary rounded-3xl p-6 text-white">
            <h3 className="font-bold font-headline text-lg mb-2">Entry Validation</h3>
            <p className="text-sm opacity-70 mb-4">Values must be between 0 and the maximum marks specified. System will flag outliers in real-time.</p>
            <div className="space-y-2.5">
              {[
                { icon: 'check_circle', label: 'No blanks allowed', ok: true },
                { icon: 'check_circle', label: 'Decimals accepted (up to .5)', ok: true },
                { icon: 'warning', label: 'Red highlights invalid entries', ok: false },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2.5 text-sm">
                  <span className={`material-symbols-outlined text-[18px] ${item.ok ? 'text-green-300' : 'text-yellow-300'}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  <span className="opacity-90">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_24px_rgba(13,28,47,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-container-low">
                  {['Roll', 'Student Name', 'Status', 'Marks Obtained', 'Remarks'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-secondary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const invalid = s.status !== 'absent' && isInvalid(s.marks);
                  return (
                    <tr key={s.roll} className="border-b border-surface-container-low/50 hover:bg-surface-container-low/40 transition-colors">
                      <td className="px-6 py-4 text-secondary font-bold text-sm">{s.roll}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColors[s.avatar] || 'bg-surface-container text-primary'}`}>
                            {s.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-primary text-sm">{s.name}</p>
                            <p className="text-[11px] text-secondary">Student ID: {s.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => updateStudent(s.roll, 'status', s.status === 'present' ? 'absent' : 'present')}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors
                            ${s.status === 'present' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-error'}`}>
                          {s.status}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={s.marks}
                          onChange={e => updateStudent(s.roll, 'marks', e.target.value)}
                          disabled={s.status === 'absent'}
                          className={`w-24 text-center rounded-xl py-2 px-3 font-bold text-sm border-2 transition-colors
                            ${invalid ? 'border-error bg-error-container text-error' : 'border-surface-container-high bg-surface-container-low text-primary focus:border-primary'}
                            disabled:opacity-40 disabled:cursor-not-allowed`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          value={s.remarks}
                          onChange={e => updateStudent(s.roll, 'remarks', e.target.value)}
                          className="bg-transparent border-none text-sm text-secondary italic focus:outline-none focus:text-primary w-full"
                          placeholder="Add remark…"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 py-5 bg-surface-container-low/50 border-t border-surface-container-low">
            <div className="flex gap-8">
              {[
                ['Total Students', '32'],
                ['Entered', `${entered}/32`],
                ['Errors Found', errors.length],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-secondary">{label}</p>
                  <p className={`text-2xl font-black font-headline ${label === 'Errors Found' && errors.length > 0 ? 'text-error' : 'text-primary'}`}>{val}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={handleSaveDraft}
                className="px-6 py-3 bg-surface-container-high text-on-primary-fixed-variant rounded-xl font-semibold hover:bg-surface-container-highest transition-all flex items-center gap-2">
                {saved ? <><span className="material-symbols-outlined text-[18px] text-green-600">check_circle</span> Saved!</> : 'Save as Draft'}
              </button>
              <button onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2">
                {submitted ? <><span className="material-symbols-outlined text-[18px]">check_circle</span> Submitted!</> : 'Submit Final Marks'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-[0_40px_80px_rgba(13,28,47,0.18)] z-10">
            <button onClick={() => setShowUploadModal(false)} className="absolute top-4 right-4 text-secondary hover:text-primary">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-2xl font-bold text-primary font-headline mb-2">Bulk Upload CSV</h2>
            <p className="text-secondary text-sm mb-6">Upload a CSV file with columns: Roll, Marks, Remarks. Download the template first.</p>
            <div className="border-2 border-dashed border-surface-container-high rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-4xl text-secondary block mb-2">upload_file</span>
              <p className="text-sm font-bold text-primary">Click to upload or drag & drop</p>
              <p className="text-xs text-secondary mt-1">CSV files only · Max 5MB</p>
              <input type="file" accept=".csv" className="hidden" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowUploadModal(false)} className="flex-1 py-3 bg-surface-container-high text-on-primary-fixed-variant rounded-xl font-semibold hover:bg-surface-container-highest transition-colors">Cancel</button>
              <button className="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-all">Upload</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
