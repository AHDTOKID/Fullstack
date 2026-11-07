import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api/client';

const initialClasses = [
  { id: 'CLS-001', name: 'Grade 10 - Section A', teacher: 'Dr. Julian Thorne', subject: 'Advanced Physics', students: 32, room: 'Lab 3A', schedule: 'Mon/Wed/Fri', status: 'active' },
  { id: 'CLS-002', name: 'Grade 10 - Section B', teacher: 'Prof. Sarah Jenkins', subject: 'History of Art', students: 28, room: 'Studio 2', schedule: 'Tue/Thu', status: 'active' },
  { id: 'CLS-003', name: 'Grade 11 - Section A', teacher: 'Ms. Priya Sharma', subject: 'Advanced Mathematics', students: 30, room: 'Room 101', schedule: 'Mon/Wed/Fri', status: 'active' },
  { id: 'CLS-004', name: 'Grade 11 - Section B', teacher: 'Mr. Carlos Rivera', subject: 'Literature', students: 25, room: 'Room 204', schedule: 'Tue/Thu/Sat', status: 'active' },
  { id: 'CLS-005', name: 'Grade 12 - Section A', teacher: 'Dr. Alice Merton', subject: 'Chemistry', students: 27, room: 'Lab 1B', schedule: 'Mon/Wed', status: 'inactive' },
];

const studentsList = [
  { roll: '001', name: 'Alex Thompson', id: '#AT-9920', email: 'alex@school.edu', gpa: '3.8', attendance: '92%', status: 'active' },
  { roll: '002', name: 'Elena Rodriguez', id: '#ER-9921', email: 'elena@school.edu', gpa: '3.5', attendance: '88%', status: 'active' },
  { roll: '003', name: 'Marcus Chen', id: '#MC-9922', email: 'marcus@school.edu', gpa: '3.2', attendance: '72%', status: 'medical-leave' },
  { roll: '004', name: 'Sasha Petrov', id: '#SP-9923', email: 'sasha@school.edu', gpa: '3.6', attendance: '95%', status: 'active' },
  { roll: '005', name: 'Priya Nair', id: '#PN-9924', email: 'priya@school.edu', gpa: '3.9', attendance: '98%', status: 'active' },
  { roll: '006', name: 'James Wu', id: '#JW-9925', email: 'james@school.edu', gpa: '3.1', attendance: '81%', status: 'active' },
];

const avatarColors = ['bg-blue-100 text-blue-700','bg-pink-100 text-pink-700','bg-gray-100 text-gray-700','bg-green-100 text-green-700','bg-purple-100 text-purple-700','bg-orange-100 text-orange-700'];

export default function ClassManagementPage() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(initialClasses[0]);
  const [classes, setClasses] = useState(initialClasses);
  const [students, setStudents] = useState(studentsList);
  const [view, setView] = useState('classes'); // 'classes' | 'students'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClass, setNewClass] = useState({ name:'', teacher:'', subject:'', room:'', schedule:'' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/classes')
      .then(res => {
        if (res.data?.success && res.data.data?.length > 0) {
          setClasses(res.data.data);
          setSelectedClass(res.data.data[0]);
        }
        if (res.data?.students?.length > 0) {
          setStudents(res.data.students.map((st, i) => ({
            roll: st.rollNumber || `00${i + 1}`,
            name: st.name,
            id: st.studentId || `#ST-99${i + 20}`,
            email: st.email,
            gpa: '3.8',
            attendance: '94%',
            status: 'active',
          })));
        }
      })
      .catch(() => {});
  }, []);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || (s.id || '').includes(search)
  );

  const addClass = async () => {
    if (!newClass.name) return;
    try {
      const res = await api.post('/classes', newClass);
      if (res.data?.success) {
        setClasses(c => [...c, res.data.data]);
      } else {
        setClasses(c => [...c, { ...newClass, classId: `CLS-00${c.length+1}`, students: 0, status: 'active' }]);
      }
    } catch {
      setClasses(c => [...c, { ...newClass, classId: `CLS-00${c.length+1}`, students: 0, status: 'active' }]);
    }
    setShowAddModal(false);
    setNewClass({ name:'', teacher:'', subject:'', room:'', schedule:'' });
  };

  return (
    <Layout>
      <div className="px-8 pb-12 pt-8 max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-secondary font-bold font-headline">Administration</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline mt-1">Class Management</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">add</span> New Class
            </button>
          </div>
        </header>

        {/* View Toggle */}
        <div className="bg-surface-container-low p-1 rounded-xl inline-flex gap-1">
          {[['classes','Class Roster'], ['students','Student List']].map(([v,l]) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-6 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all
                ${view === v ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:text-primary'}`}>{l}</button>
          ))}
        </div>

        {view === 'classes' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Class Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 gap-4">
              {classes.map(cls => (
                <div key={cls.id} onClick={() => setSelectedClass(cls)}
                  className={`rounded-3xl p-6 cursor-pointer transition-all border-2
                    ${selectedClass?.id === cls.id ? 'border-primary bg-primary/5' : 'border-transparent bg-surface-container-lowest hover:bg-surface-container-low'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${cls.status === 'active' ? 'bg-primary text-white' : 'bg-surface-container-high text-secondary'}`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>class</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-primary font-headline">{cls.name}</h3>
                        <p className="text-sm text-secondary mt-0.5">{cls.subject}</p>
                        <p className="text-[11px] text-secondary mt-1">{cls.teacher} · {cls.room}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${cls.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-surface-container-high text-secondary'}`}>
                        {cls.status}
                      </span>
                      <p className="text-lg font-black text-primary font-headline mt-2">{cls.students}</p>
                      <p className="text-[10px] text-secondary">students</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-surface-container-low">
                    <span className="flex items-center gap-1.5 text-[11px] text-secondary"><span className="material-symbols-outlined text-[14px]">schedule</span>{cls.schedule}</span>
                    <button className="ml-auto text-[11px] text-primary font-bold hover:underline">View Students →</button>
                    <button className="text-[11px] text-secondary hover:text-primary transition-colors font-bold">Edit</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Class Detail */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_4px_24px_rgba(13,28,47,0.06)] h-fit sticky top-28">
              <h2 className="text-lg font-bold text-primary font-headline mb-4">{selectedClass?.name}</h2>
              <div className="space-y-4">
                {[
                  ['Subject', selectedClass?.subject, 'menu_book'],
                  ['Teacher', selectedClass?.teacher, 'person'],
                  ['Room', selectedClass?.room, 'meeting_room'],
                  ['Schedule', selectedClass?.schedule, 'calendar_today'],
                  ['Students', selectedClass?.students, 'group'],
                ].map(([k, v, icon]) => (
                  <div key={k} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px] text-secondary">{icon}</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">{k}</p>
                      <p className="text-sm font-semibold text-primary">{v}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => navigate('/timetable')}
                  className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer shadow-sm"
                >
                  View Timetable
                </button>
                <button className="w-full py-3 bg-surface-container-high text-on-primary-fixed-variant rounded-xl font-semibold text-sm hover:bg-surface-container-highest transition-colors">
                  Send Announcement
                </button>
              </div>
            </div>
          </div>

        ) : (
          /* Student List */
          <div className="space-y-4">
            <div className="relative max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…"
                className="pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container text-sm w-full" />
            </div>

            <div className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_24px_rgba(13,28,47,0.06)] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container">
                    {['Roll', 'Student', 'Email', 'GPA', 'Attendance', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-secondary">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s, i) => (
                    <tr key={s.roll} className="border-b border-surface-container-low/50 hover:bg-surface-container-low/40 transition-colors">
                      <td className="px-5 py-4 font-bold text-secondary text-sm">{s.roll}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${avatarColors[i % 6]}`}>
                            {s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                          </div>
                          <div>
                            <p className="font-bold text-primary text-sm">{s.name}</p>
                            <p className="text-[11px] text-secondary">{s.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-secondary">{s.email}</td>
                      <td className="px-5 py-4 font-bold text-primary text-sm">{s.gpa}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-surface-container-highest rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: s.attendance }} />
                          </div>
                          <span className="text-sm font-bold text-primary">{s.attendance}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase
                          ${s.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-error-container text-error'}`}>
                          {s.status === 'medical-leave' ? 'Medical Leave' : s.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button className="text-[11px] text-primary font-bold hover:underline">View</button>
                          <button className="text-[11px] text-secondary hover:text-primary font-bold transition-colors">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-[0_40px_80px_rgba(13,28,47,0.18)] z-10">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-secondary hover:text-primary">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-2xl font-bold text-primary font-headline mb-6">Create New Class</h2>
            <div className="space-y-4">
              {[['name','Class Name','e.g. Grade 10 - Section C'],['teacher','Teacher','Dr. Jane Smith'],['subject','Subject','Advanced Mathematics'],['room','Room / Lab','Room 305'],['schedule','Schedule','Mon/Wed/Fri']].map(([k,l,p]) => (
                <div key={k}>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1.5">{l}</label>
                  <input value={newClass[k]} onChange={e => setNewClass(c => ({ ...c, [k]: e.target.value }))}
                    placeholder={p} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-container" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-surface-container-high rounded-xl font-semibold text-on-primary-fixed-variant hover:bg-surface-container-highest transition-colors">Cancel</button>
              <button onClick={addClass} className="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-all">Create Class</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
