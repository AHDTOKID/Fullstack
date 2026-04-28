import { useState } from 'react';
import Layout from '../components/Layout';

const initialFees = [
  { id: 'FEE-001', student: 'Alex Thompson', studentId: '#AT-9920', class: 'Grade 10-A', amount: 15000, paid: 15000, due: 0, dueDate: '2024-04-15', status: 'paid' },
  { id: 'FEE-002', student: 'Elena Rodriguez', studentId: '#ER-9921', class: 'Grade 10-A', amount: 15000, paid: 7500, due: 7500, dueDate: '2024-04-20', status: 'partial' },
  { id: 'FEE-003', student: 'Marcus Chen', studentId: '#MC-9922', class: 'Grade 10-A', amount: 15000, paid: 0, due: 15000, dueDate: '2024-04-10', status: 'overdue' },
  { id: 'FEE-004', student: 'Sasha Petrov', studentId: '#SP-9923', class: 'Grade 10-A', amount: 15000, paid: 15000, due: 0, dueDate: '2024-04-18', status: 'paid' },
  { id: 'FEE-005', student: 'Priya Nair', studentId: '#PN-9924', class: 'Grade 10-B', amount: 15000, paid: 0, due: 15000, dueDate: '2024-04-22', status: 'pending' },
  { id: 'FEE-006', student: 'James Wu', studentId: '#JW-9925', class: 'Grade 10-B', amount: 15000, paid: 10000, due: 5000, dueDate: '2024-04-25', status: 'partial' },
];

const statusConfig = {
  paid: { label: 'Paid', cls: 'bg-green-50 text-green-700' },
  partial: { label: 'Partial', cls: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  overdue: { label: 'Overdue', cls: 'bg-error-container text-error' },
  pending: { label: 'Pending', cls: 'bg-surface-container-highest text-secondary' },
};

const avatarColors = ['bg-blue-100 text-blue-700','bg-pink-100 text-pink-700','bg-gray-100 text-gray-700','bg-green-100 text-green-700','bg-purple-100 text-purple-700','bg-orange-100 text-orange-700'];

export default function FeeManagementPage() {
  const [fees, setFees] = useState(initialFees);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  const filtered = fees.filter(f =>
    (filter === 'all' || f.status === filter) &&
    (f.student.toLowerCase().includes(search.toLowerCase()) || f.id.includes(search))
  );

  const totalCollected = fees.reduce((sum, f) => sum + f.paid, 0);
  const totalPending = fees.reduce((sum, f) => sum + f.due, 0);
  const paidCount = fees.filter(f => f.status === 'paid').length;
  const overdueCount = fees.filter(f => f.status === 'overdue').length;

  const handleRecordPayment = (fee) => { setSelectedFee(fee); setPaymentAmount(fee.due); setShowModal(true); };

  const submitPayment = () => {
    const amt = Math.min(Number(paymentAmount), selectedFee.due);
    setFees(f => f.map(fee => fee.id !== selectedFee.id ? fee : {
      ...fee, paid: fee.paid + amt, due: fee.due - amt,
      status: fee.due - amt <= 0 ? 'paid' : fee.due - amt < fee.amount ? 'partial' : fee.status
    }));
    setShowModal(false); setPaymentAmount('');
  };

  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <Layout>
      <div className="px-8 pb-12 pt-8 max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-secondary font-bold font-headline">Finance</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline mt-1">Fee Management</h1>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-surface-container-high text-on-primary-fixed-variant rounded-xl font-semibold text-sm hover:bg-surface-container-highest transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">download</span> Export Report
            </button>
            <button className="px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">add</span> Add Fee Record
            </button>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Total Collected', value: fmt(totalCollected), icon: 'payments', color: 'bg-primary text-white' },
            { label: 'Outstanding', value: fmt(totalPending), icon: 'pending_actions', color: 'bg-error-container text-error' },
            { label: 'Fully Paid', value: `${paidCount}/${fees.length}`, icon: 'check_circle', color: 'bg-green-50 text-green-700' },
            { label: 'Overdue', value: overdueCount, icon: 'warning', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
          ].map(s => (
            <div key={s.label} className={`rounded-3xl p-5 ${s.color}`}>
              <span className="material-symbols-outlined text-[28px] opacity-70 mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              <p className="text-2xl font-black font-headline">{s.value}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID…"
              className="pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container text-sm w-full" />
          </div>
          <div className="bg-surface-container-low p-1 rounded-xl flex gap-1">
            {['all', 'paid', 'partial', 'pending', 'overdue'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all
                  ${filter === f ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:text-primary'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Fee Table */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_24px_rgba(13,28,47,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container">
                  {['Receipt ID', 'Student', 'Class', 'Total Fee', 'Paid', 'Due', 'Due Date', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-secondary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((fee, i) => (
                  <tr key={fee.id} className="border-b border-surface-container-low/50 hover:bg-surface-container-low/40 transition-colors">
                    <td className="px-5 py-4 text-xs font-bold text-secondary">{fee.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${avatarColors[i % 6]}`}>
                          {fee.student.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <p className="font-bold text-primary text-sm">{fee.student}</p>
                          <p className="text-[11px] text-secondary">{fee.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-secondary">{fee.class}</td>
                    <td className="px-5 py-4 font-bold text-primary text-sm">{fmt(fee.amount)}</td>
                    <td className="px-5 py-4 text-sm text-green-700 font-bold">{fmt(fee.paid)}</td>
                    <td className="px-5 py-4 text-sm font-bold text-error">{fee.due > 0 ? fmt(fee.due) : '—'}</td>
                    <td className="px-5 py-4 text-sm text-secondary">{fee.dueDate}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase ${statusConfig[fee.status].cls}`}>
                        {statusConfig[fee.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {fee.status !== 'paid' && (
                        <button onClick={() => handleRecordPayment(fee)}
                          className="px-3 py-1.5 bg-primary text-white rounded-lg text-[11px] font-bold hover:bg-primary-container transition-colors">
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Progress bar */}
          <div className="px-6 py-4 border-t border-surface-container-low bg-surface-container-low/30">
            <div className="flex justify-between text-[11px] text-secondary font-bold mb-2">
              <span>Collection Progress</span>
              <span>{Math.round((totalCollected / (totalCollected + totalPending)) * 100)}%</span>
            </div>
            <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all"
                style={{ width: `${(totalCollected / (totalCollected + totalPending)) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && selectedFee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-[0_40px_80px_rgba(13,28,47,0.18)] z-10">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-secondary hover:text-primary">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-2xl font-bold text-primary font-headline mb-1">Record Payment</h2>
            <p className="text-secondary text-sm mb-6">{selectedFee.student} · {selectedFee.studentId}</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-low rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Outstanding</p>
                  <p className="font-black text-error font-headline text-xl">{fmt(selectedFee.due)}</p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Already Paid</p>
                  <p className="font-black text-green-700 font-headline text-xl">{fmt(selectedFee.paid)}</p>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">Payment Amount (₹)</label>
                <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)}
                  max={selectedFee.due} min={1}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-lg font-bold text-primary focus:ring-2 focus:ring-primary-container" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-surface-container-high rounded-xl font-semibold text-on-primary-fixed-variant hover:bg-surface-container-highest transition-colors">Cancel</button>
              <button onClick={submitPayment} className="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-all">Confirm Payment</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
