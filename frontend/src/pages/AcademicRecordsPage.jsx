import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import api from '../api/client';

const avatarColors = {
  AT: 'bg-blue-100 text-blue-700',
  ER: 'bg-pink-100 text-pink-700',
  MC: 'bg-gray-100 text-gray-700',
  DK: 'bg-amber-100 text-amber-700',
  CB: 'bg-teal-100 text-teal-700',
  LG: 'bg-indigo-100 text-indigo-700',
  PN: 'bg-purple-100 text-purple-700',
  JW: 'bg-orange-100 text-orange-700',
  AP: 'bg-emerald-100 text-emerald-700',
  NM: 'bg-cyan-100 text-cyan-700',
  SZ: 'bg-rose-100 text-rose-700',
  ED: 'bg-violet-100 text-violet-700',
  SP: 'bg-green-100 text-green-700',
  BH: 'bg-yellow-100 text-yellow-800',
  ML: 'bg-fuchsia-100 text-fuchsia-700',
  OQ: 'bg-lime-100 text-lime-800',
  FZ: 'bg-sky-100 text-sky-700',
  DF: 'bg-blue-100 text-blue-800',
  ZW: 'bg-pink-100 text-pink-800',
  WC: 'bg-slate-200 text-slate-800',
  VS: 'bg-purple-100 text-purple-800',
  CN: 'bg-teal-100 text-teal-800',
  TA: 'bg-emerald-100 text-emerald-800',
};

export default function AcademicRecordsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const studentClass = user?.studentClass || 'Grade 10 - Section A';

  const [classes, setClasses] = useState([
    'Grade 10 - Section A',
    'Grade 10 - Section B',
    'Grade 11 - Section A',
    'Grade 11 - Section B',
    'Grade 12 - Section A',
  ]);
  const [selectedClass, setSelectedClass] = useState(isStudent ? studentClass : 'Grade 10 - Section A');
  const [subjects, setSubjects] = useState(['Theoretical Physics', 'Advanced Mathematics', 'Chemistry', 'Literature & Composition', 'History of Art']);
  const [selectedSubject, setSelectedSubject] = useState('Theoretical Physics');
  const [maxMarks, setMaxMarks] = useState(100);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  // Student report card state
  const [activeView, setActiveView] = useState(isStudent ? 'report' : 'roster'); // 'roster' | 'report'
  const [myReport, setMyReport] = useState(null);

  // Fetch academic record for selectedClass and selectedSubject
  const fetchRecords = useCallback(async (cls, subj) => {
    setLoading(true);
    try {
      const res = await api.get(`/records?className=${encodeURIComponent(cls)}&subject=${encodeURIComponent(subj)}&term=Final Examination 2024`);
      if (res.data?.success && res.data.data) {
        setStudents(res.data.data.records || []);
        setMaxMarks(res.data.data.maxMarks || 100);
        if (res.data.availableClasses) setClasses(res.data.availableClasses);
        if (res.data.availableSubjects) setSubjects(res.data.availableSubjects);
      }
    } catch (err) {
      console.error('Failed to fetch records:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch student's personal report across all subjects
  const fetchMyReport = useCallback(async () => {
    try {
      const res = await api.get('/records/my');
      if (res.data?.success) {
        setMyReport(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch my report card:', err);
    }
  }, []);

  useEffect(() => {
    fetchRecords(selectedClass, selectedSubject);
  }, [fetchRecords, selectedClass, selectedSubject]);

  useEffect(() => {
    if (isStudent) {
      fetchMyReport();
    }
  }, [isStudent, fetchMyReport]);

  const handleClassChange = (newClass) => {
    setSelectedClass(newClass);
    // Fetch records with empty subject to let controller pick the first subject of that new class
    api.get(`/records?className=${encodeURIComponent(newClass)}&term=Final Examination 2024`)
      .then((res) => {
        if (res.data?.success) {
          const newSubjects = res.data.availableSubjects || [];
          setSubjects(newSubjects);
          const firstSubj = newSubjects[0] || '';
          setSelectedSubject(firstSubj);
          setStudents(res.data.data?.records || []);
          setMaxMarks(res.data.data?.maxMarks || 100);
        }
      })
      .catch(console.error);
  };

  const handleSubjectChange = (newSubject) => {
    setSelectedSubject(newSubject);
    fetchRecords(selectedClass, newSubject);
  };

  const updateStudent = (roll, field, value) => {
    setStudents((s) => s.map((st) => (st.roll === roll ? { ...st, [field]: value } : st)));
    setSaved(false);
  };

  const isInvalid = (marks) => {
    if (marks === '') return false;
    const n = parseFloat(marks);
    return isNaN(n) || n < 0 || n > maxMarks;
  };

  const errors = students.filter((s) => s.status !== 'absent' && isInvalid(s.marks));
  const entered = students.filter((s) => s.marks !== '' && !isInvalid(s.marks)).length;

  const handleSaveDraft = async () => {
    try {
      await api.post('/records', {
        className: selectedClass,
        subject: selectedSubject,
        term: 'Final Examination 2024',
        maxMarks,
        records: students,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save marks draft.');
    }
  };

  const handleSubmit = async () => {
    if (errors.length > 0) return alert('Please fix marks errors before submitting.');
    try {
      await api.post('/records', {
        className: selectedClass,
        subject: selectedSubject,
        term: 'Final Examination 2024',
        maxMarks,
        records: students,
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit marks.');
    }
  };

  const handleDownloadTemplate = () => {
    const csv = [
      'Roll,Student Name,Student ID,Status,Marks,Remarks',
      ...students.map((s) => `${s.roll},${s.studentName},${s.studentId},${s.status},${s.marks},${s.remarks}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${selectedClass.replace(/\s+/g, '_')}_${selectedSubject.replace(/\s+/g, '_')}_marks.csv`;
    a.click();
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text !== 'string') return;
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length <= 1) return;

      const updated = [...students];
      lines.slice(1).forEach((line) => {
        const parts = line.split(',');
        if (parts.length >= 5) {
          const [roll, , , status, marks, remarks] = parts;
          const idx = updated.findIndex((st) => st.roll === roll.trim());
          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              status: (status?.trim() === 'absent' ? 'absent' : 'present'),
              marks: marks?.trim() || '',
              remarks: remarks?.trim() || updated[idx].remarks,
            };
          }
        }
      });
      setStudents(updated);
      setShowUploadModal(false);
      setCsvFile(null);
      alert('CSV marks imported successfully!');
    };
    reader.readAsText(file);
  };

  return (
    <Layout>
      <div className="px-6 md:px-8 pb-12 pt-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-secondary font-bold font-headline">Academic Evaluation</span>
              {isStudent && (
                <span className="bg-primary-container text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full">
                  Student Assessment
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline mt-1">
              Academic Records & Marks
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-secondary">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-[16px] text-green-600">verified</span>
                Term: Final Examination 2024
              </span>
              <span className="w-1 h-1 rounded-full bg-secondary/40" />
              <span>Distinct section grading</span>
            </div>
          </div>

          {isStudent && (
            <div className="bg-surface-container-low p-1 rounded-2xl inline-flex gap-1">
              <button
                onClick={() => setActiveView('report')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'report' ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:text-primary'
                }`}
              >
                My Report Card
              </button>
              <button
                onClick={() => setActiveView('roster')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'roster' ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:text-primary'
                }`}
              >
                Class Marks Sheet
              </button>
            </div>
          )}
        </header>

        {/* STUDENT PERSONAL REPORT CARD VIEW */}
        {isStudent && activeView === 'report' && myReport && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-6 sm:p-8 text-white shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="px-3 py-1 bg-white/15 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary-fixed">
                    Official Student Transcript
                  </span>
                  <h2 className="text-3xl font-extrabold font-headline mt-2">{myReport.studentName}</h2>
                  <p className="text-white/80 text-sm mt-1">
                    Student ID: <span className="font-semibold text-white">{myReport.studentId || user.studentId}</span> · Class: <span className="font-semibold text-white">{myReport.studentClass}</span>
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center border border-white/10">
                  <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold">Term GPA</p>
                  <p className="text-3xl font-black font-headline text-white mt-1">3.85 / 4.0</p>
                  <span className="text-[10px] text-green-300 font-bold">Grade: First Class with Distinction</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl shadow-sm p-6 border border-surface-container-low">
              <h3 className="text-lg font-bold text-primary font-headline mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Subject-Wise Performance & Remarks
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-container-low text-[10px] uppercase tracking-widest text-secondary font-bold">
                      <th className="py-3 text-left">Subject</th>
                      <th className="py-3 text-center">Status</th>
                      <th className="py-3 text-center">Marks Obtained</th>
                      <th className="py-3 text-center">Grade</th>
                      <th className="py-3 text-left">Faculty Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(myReport.reportCard || []).map((row, idx) => {
                      const num = parseFloat(row.marks);
                      const grade = isNaN(num) ? '—' : num >= 90 ? 'A+' : num >= 80 ? 'A' : num >= 70 ? 'B+' : 'B';
                      return (
                        <tr key={idx} className="border-b border-surface-container-low/60 hover:bg-surface-container-low/20 transition-colors">
                          <td className="py-3.5 font-bold text-primary text-sm">{row.subject}</td>
                          <td className="py-3.5 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              row.status === 'present' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-center font-bold text-primary text-sm">
                            {row.marks ? `${row.marks} / ${row.maxMarks}` : 'Absent'}
                          </td>
                          <td className="py-3.5 text-center font-black text-primary text-sm">
                            <span className="px-2 py-0.5 rounded-md bg-primary-container/20 text-primary">
                              {grade}
                            </span>
                          </td>
                          <td className="py-3.5 text-secondary italic text-xs">
                            {row.remarks || 'Consistent effort and participation.'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION MARKS ENTRY TABLE (TEACHER, ADMIN, OR ROSTER VIEW) */}
        {(!isStudent || activeView === 'roster') && (
          <>
            {/* Controls Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl p-6 shadow-[0_4px_24px_rgba(13,28,47,0.06)] border border-surface-container-low">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Select Class */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">
                      Select Class Section
                    </label>
                    <div className="relative">
                      <select
                        value={selectedClass}
                        onChange={(e) => handleClassChange(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-4 pr-10 appearance-none focus:ring-2 focus:ring-primary-container text-sm font-semibold cursor-pointer shadow-sm"
                      >
                        {classes.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Select Subject */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">
                      Select Subject
                    </label>
                    <div className="relative">
                      <select
                        value={selectedSubject}
                        onChange={(e) => handleSubjectChange(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-4 pr-10 appearance-none focus:ring-2 focus:ring-primary-container text-sm font-semibold cursor-pointer shadow-sm"
                      >
                        {subjects.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Max Marks */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">
                      Max Marks
                    </label>
                    <input
                      type="number"
                      value={maxMarks}
                      disabled={isStudent}
                      onChange={(e) => setMaxMarks(Number(e.target.value))}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-container text-sm font-bold text-primary shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-semibold">Active Roster: {students.length} students</span>
                  </div>
                  <button
                    onClick={handleDownloadTemplate}
                    className="px-4 py-2 bg-surface-container-high text-on-primary-fixed-variant rounded-xl font-bold text-xs hover:bg-surface-container-highest transition-all flex items-center gap-2 cursor-pointer ml-auto"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Export CSV
                  </button>
                  {!isStudent && (
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-2 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">upload_file</span>
                      Bulk Upload CSV
                    </button>
                  )}
                </div>
              </div>

              {/* Validation Summary Card */}
              <div className="bg-primary rounded-3xl p-6 text-white shadow-md flex flex-col justify-between">
                <div>
                  <h3 className="font-bold font-headline text-lg mb-1">{selectedSubject}</h3>
                  <p className="text-xs opacity-75 mb-3">{selectedClass} · Grading Criterion</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="material-symbols-outlined text-green-300 text-sm">check_circle</span>
                      <span>Marks capped at {maxMarks} maximum</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="material-symbols-outlined text-green-300 text-sm">check_circle</span>
                      <span>Distinct student records for {selectedClass}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="material-symbols-outlined text-yellow-300 text-sm">info</span>
                      <span>Decimals up to .5 supported</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-70">Entered Marks</p>
                    <p className="text-xl font-black font-headline">{entered} / {students.length}</p>
                  </div>
                  {errors.length > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-red-500/30 text-red-200 text-xs font-bold">
                      {errors.length} invalid entries
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Marks Table */}
            <div className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_24px_rgba(13,28,47,0.06)] overflow-hidden border border-surface-container-low">
              {loading ? (
                <div className="p-16 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <p className="text-sm font-semibold text-secondary">Loading marks for {selectedClass}…</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-surface-container-low bg-surface-container-low/50">
                        {['Roll', 'Student Name', 'Status', 'Marks Obtained', 'Remarks'].map((h) => (
                          <th key={h} className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-secondary">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => {
                        const invalid = s.status !== 'absent' && isInvalid(s.marks);
                        return (
                          <tr key={s.roll} className="border-b border-surface-container-low/50 hover:bg-surface-container-low/30 transition-colors">
                            <td className="px-6 py-4 text-secondary font-bold text-sm">{s.roll}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                    avatarColors[s.avatar] || 'bg-surface-container text-primary font-bold'
                                  }`}
                                >
                                  {s.avatar || s.studentName.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-primary text-sm">{s.studentName}</p>
                                  <p className="text-[11px] text-secondary">Student ID: {s.studentId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                type="button"
                                disabled={isStudent}
                                onClick={() => updateStudent(s.roll, 'status', s.status === 'present' ? 'absent' : 'present')}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                  !isStudent ? 'cursor-pointer' : 'cursor-default'
                                } ${
                                  s.status === 'present'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}
                              >
                                {s.status}
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                value={s.marks}
                                disabled={isStudent || s.status === 'absent'}
                                onChange={(e) => updateStudent(s.roll, 'marks', e.target.value)}
                                className={`w-28 text-center rounded-xl py-2 px-3 font-bold text-sm border-2 transition-colors ${
                                  invalid
                                    ? 'border-red-500 bg-red-50 text-red-700'
                                    : 'border-surface-container-high bg-surface-container-low text-primary focus:border-primary'
                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                value={s.remarks || ''}
                                disabled={isStudent}
                                onChange={(e) => updateStudent(s.roll, 'remarks', e.target.value)}
                                className="bg-transparent border-none text-sm text-secondary italic focus:outline-none focus:text-primary w-full disabled:cursor-default"
                                placeholder="Add faculty remarks…"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Footer Save Row */}
              {!isStudent && (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 py-5 bg-surface-container-low/50 border-t border-surface-container-low">
                  <div className="flex gap-8">
                    {[
                      ['Total In Class', students.length],
                      ['Entered', `${entered}/${students.length}`],
                      ['Outliers / Errors', errors.length],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-secondary">{label}</p>
                        <p
                          className={`text-2xl font-black font-headline ${
                            label === 'Outliers / Errors' && errors.length > 0 ? 'text-red-600' : 'text-primary'
                          }`}
                        >
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveDraft}
                      className="px-6 py-2.5 bg-surface-container-high text-on-primary-fixed-variant rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {saved ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] text-green-600">check_circle</span>
                          Saved to DB!
                        </>
                      ) : (
                        'Save as Draft'
                      )}
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-7 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      {submitted ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] text-green-300">verified</span>
                          Marks Published!
                        </>
                      ) : (
                        'Submit Final Marks'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
            <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl z-10">
              <button onClick={() => setShowUploadModal(false)} className="absolute top-5 right-5 text-secondary hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
              <h2 className="text-2xl font-bold text-primary font-headline mb-1">Bulk Upload Marks CSV</h2>
              <p className="text-secondary text-sm mb-4">
                Upload CSV file for <span className="font-bold text-primary">{selectedClass}</span> · <span className="font-bold text-primary">{selectedSubject}</span>.
              </p>

              <label className="border-2 border-dashed border-surface-container-high rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer block">
                <span className="material-symbols-outlined text-4xl text-primary block mb-2">upload_file</span>
                <p className="text-sm font-bold text-primary">
                  {csvFile ? csvFile.name : 'Select or drop CSV file'}
                </p>
                <p className="text-xs text-secondary mt-1">Columns: Roll, Student Name, Student ID, Status, Marks, Remarks</p>
                <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
              </label>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 bg-surface-container-high rounded-xl font-semibold text-sm hover:bg-surface-container-highest cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
