import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import api from '../api/client';

const statusConfig = {
  paid: { label: 'Paid', cls: 'bg-green-50 text-green-700 border border-green-200' },
  partial: { label: 'Partial', cls: 'bg-amber-50 text-amber-800 border border-amber-200' },
  overdue: { label: 'Overdue', cls: 'bg-red-50 text-red-700 border border-red-200' },
  pending: { label: 'Pending', cls: 'bg-surface-container-highest text-secondary border border-surface-container' },
};

const avatarColors = [
  'bg-blue-100 text-blue-700',
  'bg-pink-100 text-pink-700',
  'bg-gray-100 text-gray-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
];

const POPULAR_BANKS = [
  { id: 'sbi', name: 'State Bank of India', code: 'SBIN' },
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICIC' },
  { id: 'axis', name: 'Axis Bank', code: 'UTIB' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', code: 'KKBK' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PUNB' },
];

export default function FeeManagementPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  const [fees, setFees] = useState([]);
  const [stats, setStats] = useState({ totalCollected: 0, totalPending: 0, paidCount: 0, overdueCount: 0, totalCount: 0 });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Payment Modal States
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('card'); // 'card' | 'upi' | 'netbanking'
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null); // transaction data after success

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.name || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UPI Form State
  const [upiId, setUpiId] = useState('');

  // Net Banking Form State
  const [selectedBank, setSelectedBank] = useState('hdfc');

  // Add Fee Modal (Faculty/Admin)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFeeForm, setNewFeeForm] = useState({
    studentName: '',
    studentId: '',
    studentEmail: '',
    class: 'Grade 10 - Section A',
    amount: '15000',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Receipt Modal State
  const [receiptData, setReceiptData] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const fetchFees = useCallback(async () => {
    setLoading(true);
    try {
      const params = isStudent ? '' : `?filter=${filter}&search=${encodeURIComponent(search)}`;
      const res = await api.get(`/fees${params}`);
      if (res.data?.success) {
        setFees(res.data.data || []);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch fees:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, search, isStudent]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const openPaymentModal = (fee) => {
    setSelectedFee(fee);
    setPayAmount(fee.due);
    setPayMethod('card');
    setPaymentSuccess(null);
    setCardNumber('4242 •••• •••• 4242');
    setCardExpiry('12/28');
    setCardCvv('888');
    setCardHolder(user?.name || fee.studentName);
    setUpiId(`${(user?.name || 'student').toLowerCase().replace(/\s+/g, '')}@okaxis`);
    setShowPayModal(true);
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    setCardExpiry(raw);
  };

  const executePayment = async (e) => {
    e.preventDefault();
    if (!selectedFee) return;

    const amountNum = Number(payAmount);
    if (!amountNum || amountNum <= 0 || amountNum > selectedFee.due) {
      alert(`Please enter a valid payment amount between ₹1 and ₹${selectedFee.due}.`);
      return;
    }

    setProcessing(true);
    try {
      const paymentDetails = {
        cardHolder,
        cardLast4: cardNumber.replace(/\s+/g, '').slice(-4) || '4242',
        cardBrand: 'Visa',
        upiId: payMethod === 'upi' ? upiId : '',
        bankName: payMethod === 'netbanking' ? POPULAR_BANKS.find((b) => b.id === selectedBank)?.name : '',
      };

      const res = await api.post(`/fees/${selectedFee._id}/pay`, {
        amount: amountNum,
        paymentMethod: payMethod,
        paymentDetails,
      });

      if (res.data?.success) {
        setPaymentSuccess({
          transaction: res.data.transaction,
          fee: res.data.data,
        });
        // Refresh fees in background
        fetchFees();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const openReceiptView = (fee, txn) => {
    setReceiptData({
      institute: 'The Academic Atelier',
      receiptNumber: txn.receiptNumber,
      transactionId: txn.transactionId,
      date: new Date(txn.paidAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      studentName: fee.studentName,
      studentId: fee.studentId,
      studentEmail: fee.studentEmail || user?.email,
      class: fee.class,
      paymentMethod: txn.paymentMethod.toUpperCase(),
      paymentDetails: txn.paymentDetails,
      amountPaid: txn.amount,
      totalFee: fee.amount,
      totalPaid: fee.paid,
      outstandingDue: fee.due,
      status: 'PAID & CONFIRMED',
      breakdown: fee.breakdown || [],
    });
    setShowReceiptModal(true);
  };

  const handleAddFeeSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fees', newFeeForm);
      setShowAddModal(false);
      setNewFeeForm({
        studentName: '',
        studentId: '',
        studentEmail: '',
        class: 'Grade 10 - Section A',
        amount: '15000',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      fetchFees();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create fee record.');
    }
  };

  const exportReport = () => {
    const csvRows = [
      ['Receipt ID', 'Student Name', 'Student ID', 'Class', 'Total Fee', 'Paid', 'Due', 'Due Date', 'Status'],
      ...fees.map((f) => [f.receiptId, f.studentName, f.studentId, f.class, f.amount, f.paid, f.due, f.dueDate, f.status]),
    ];
    const csvContent = csvRows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `academic_fee_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Student Primary Fee Record
  const studentFee = isStudent && fees.length > 0 ? fees[0] : null;

  return (
    <Layout>
      <div className="px-6 md:px-8 pb-12 pt-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-secondary font-bold font-headline">Finance & Dues</span>
              <span className="bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Integrated Payment System
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline mt-1">
              Fee Management
            </h1>
            <p className="text-secondary text-sm mt-1">
              {isStudent
                ? `Manage your semester academic tuition, dues, and instant online fee payment.`
                : 'Track student receivables, reconcile online transactions, and generate fee reports.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isStudent && (
              <>
                <button
                  onClick={exportReport}
                  className="px-4 py-2.5 bg-surface-container-high text-on-primary-fixed-variant rounded-xl font-semibold text-sm hover:bg-surface-container-highest transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span> Export Report
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span> Add Fee Record
                </button>
              </>
            )}
            {isStudent && studentFee && studentFee.due > 0 && (
              <button
                onClick={() => openPaymentModal(studentFee)}
                className="px-6 py-2.5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl font-bold text-sm hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg animate-pulse"
              >
                <span className="material-symbols-outlined text-[20px]">payments</span> Pay Outstanding (₹{studentFee.due.toLocaleString('en-IN')})
              </button>
            )}
          </div>
        </header>

        {/* ================= STUDENT VIEW ================= */}
        {isStudent && studentFee && (
          <div className="space-y-8">
            {/* Student Account Overview Banner */}
            <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <span className="px-3 py-1 bg-white/15 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary-fixed">
                    Academic Year 2024–2025 · {studentFee.term}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-headline mt-3">
                    {studentFee.studentName}
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    Student ID: <span className="font-semibold text-white">{studentFee.studentId}</span> · Class: <span className="font-semibold text-white">{studentFee.class}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold">Outstanding Balance</p>
                    <p className="text-3xl sm:text-4xl font-black font-headline text-white mt-1">
                      {fmt(studentFee.due)}
                    </p>
                  </div>
                  {studentFee.due > 0 ? (
                    <button
                      onClick={() => openPaymentModal(studentFee)}
                      className="ml-auto px-6 py-3 bg-white text-primary font-bold rounded-xl text-sm hover:bg-white/90 transition-all shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">credit_card</span>
                      Pay Online Now
                    </button>
                  ) : (
                    <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-400/30">
                      <span className="material-symbols-outlined text-base">verified</span>
                      All Dues Cleared
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4 Summary Stat Widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-surface-container-low">
                <p className="text-[10px] uppercase tracking-widest font-bold text-secondary">Total Course Fee</p>
                <p className="text-2xl font-black text-primary font-headline mt-1">{fmt(studentFee.amount)}</p>
                <p className="text-xs text-secondary mt-1">Full Academic Term</p>
              </div>
              <div className="bg-green-50/80 rounded-3xl p-5 border border-green-200">
                <p className="text-[10px] uppercase tracking-widest font-bold text-green-800">Amount Paid</p>
                <p className="text-2xl font-black text-green-700 font-headline mt-1">{fmt(studentFee.paid)}</p>
                <p className="text-xs text-green-700/80 mt-1">Confirmed Receipts</p>
              </div>
              <div className="bg-amber-50/80 rounded-3xl p-5 border border-amber-200">
                <p className="text-[10px] uppercase tracking-widest font-bold text-amber-800">Remaining Balance</p>
                <p className="text-2xl font-black text-amber-900 font-headline mt-1">{fmt(studentFee.due)}</p>
                <p className="text-xs text-amber-700/80 mt-1">Due Date: {studentFee.dueDate}</p>
              </div>
              <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-surface-container-low">
                <p className="text-[10px] uppercase tracking-widest font-bold text-secondary">Payment Status</p>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusConfig[studentFee.status].cls}`}>
                    {statusConfig[studentFee.status].label}
                  </span>
                </div>
                <p className="text-xs text-secondary mt-2">Receipt: {studentFee.receiptId}</p>
              </div>
            </div>

            {/* Fee Breakdown & Online Payment Box */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Fee Breakdown Card */}
              <div className="lg:col-span-1 bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-container-low">
                <h3 className="text-lg font-bold text-primary font-headline mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">receipt_long</span>
                  Fee Breakdown
                </h3>
                <div className="space-y-3">
                  {(studentFee.breakdown || []).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2.5 border-b border-surface-container-low text-sm">
                      <span className="text-secondary font-medium">{item.category}</span>
                      <span className="font-bold text-primary">{fmt(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 font-bold text-base text-primary">
                    <span>Total Allocated Fee</span>
                    <span>{fmt(studentFee.amount)}</span>
                  </div>
                </div>

                {studentFee.due > 0 && (
                  <button
                    onClick={() => openPaymentModal(studentFee)}
                    className="w-full mt-6 py-3.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">payment</span>
                    Proceed to Online Payment
                  </button>
                )}
              </div>

              {/* Transaction History Card */}
              <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-container-low">
                <h3 className="text-lg font-bold text-primary font-headline mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  Payment & Transaction History
                </h3>

                {studentFee.transactions?.length === 0 ? (
                  <div className="py-12 text-center text-secondary">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">receipt</span>
                    <p className="font-bold text-primary">No payments recorded yet</p>
                    <p className="text-xs text-secondary mt-1">Use the payment system above to settle your semester fees.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-surface-container-low text-[10px] uppercase tracking-widest text-secondary font-bold">
                          <th className="py-3 text-left">Txn Reference</th>
                          <th className="py-3 text-left">Date</th>
                          <th className="py-3 text-left">Method</th>
                          <th className="py-3 text-left">Amount</th>
                          <th className="py-3 text-left">Status</th>
                          <th className="py-3 text-right">Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentFee.transactions.map((txn) => (
                          <tr key={txn.transactionId} className="border-b border-surface-container-low/60 hover:bg-surface-container-low/20 transition-colors">
                            <td className="py-3.5 font-bold text-primary text-xs font-mono">{txn.transactionId}</td>
                            <td className="py-3.5 text-xs text-secondary">
                              {new Date(txn.paidAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="py-3.5 text-xs font-semibold capitalize text-primary flex items-center gap-1.5 mt-2">
                              <span className="material-symbols-outlined text-sm text-secondary">
                                {txn.paymentMethod === 'card' ? 'credit_card' : txn.paymentMethod === 'upi' ? 'qr_code' : 'account_balance'}
                              </span>
                              {txn.paymentMethod}
                            </td>
                            <td className="py-3.5 font-bold text-green-700 text-sm">{fmt(txn.amount)}</td>
                            <td className="py-3.5">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-200">
                                {txn.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-right">
                              <button
                                onClick={() => openReceiptView(studentFee, txn)}
                                className="px-3 py-1.5 bg-surface-container-high text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[14px]">download</span> Receipt
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= FACULTY / ADMIN VIEW ================= */}
        {!isStudent && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Collected', value: fmt(stats.totalCollected), icon: 'payments', color: 'bg-primary text-white' },
                { label: 'Total Outstanding', value: fmt(stats.totalPending), icon: 'pending_actions', color: 'bg-red-50 text-red-700 border border-red-200' },
                { label: 'Fully Paid Records', value: `${stats.paidCount}/${stats.totalCount}`, icon: 'check_circle', color: 'bg-green-50 text-green-700 border border-green-200' },
                { label: 'Overdue Payments', value: stats.overdueCount, icon: 'warning', color: 'bg-amber-50 text-amber-800 border border-amber-200' },
              ].map((s) => (
                <div key={s.label} className={`rounded-3xl p-5 shadow-sm ${s.color}`}>
                  <span className="material-symbols-outlined text-[26px] opacity-80 mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {s.icon}
                  </span>
                  <p className="text-2xl font-black font-headline">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full max-w-xs">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student, ID, receipt…"
                  className="pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container text-sm w-full shadow-sm"
                />
              </div>

              <div className="bg-surface-container-low p-1 rounded-xl flex flex-wrap gap-1">
                {['all', 'paid', 'partial', 'pending', 'overdue'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      filter === f ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:text-primary'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Fee Records Table */}
            <div className="bg-surface-container-lowest rounded-3xl shadow-[0_4px_24px_rgba(13,28,47,0.06)] overflow-hidden border border-surface-container-low">
              {loading ? (
                <div className="p-16 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <p className="text-sm font-semibold text-secondary">Loading fee records…</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-surface-container">
                        {['Receipt ID', 'Student', 'Class', 'Total Fee', 'Paid', 'Due', 'Due Date', 'Status', 'Action'].map((h) => (
                          <th key={h} className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-secondary">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map((fee, i) => (
                        <tr key={fee._id || fee.receiptId} className="border-b border-surface-container-low/50 hover:bg-surface-container-low/30 transition-colors">
                          <td className="px-5 py-4 text-xs font-bold text-secondary font-mono">{fee.receiptId}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColors[i % 6]}`}>
                                {fee.studentName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-bold text-primary text-sm">{fee.studentName}</p>
                                <p className="text-[11px] text-secondary">{fee.studentId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-secondary">{fee.class}</td>
                          <td className="px-5 py-4 font-bold text-primary text-sm">{fmt(fee.amount)}</td>
                          <td className="px-5 py-4 text-sm text-green-700 font-bold">{fmt(fee.paid)}</td>
                          <td className="px-5 py-4 text-sm font-bold text-red-600">{fee.due > 0 ? fmt(fee.due) : '—'}</td>
                          <td className="px-5 py-4 text-sm text-secondary">{fee.dueDate}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusConfig[fee.status].cls}`}>
                              {statusConfig[fee.status].label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              {fee.due > 0 ? (
                                <button
                                  onClick={() => openPaymentModal(fee)}
                                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-[11px] font-bold hover:bg-primary-container transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                                >
                                  Take Payment
                                </button>
                              ) : fee.transactions?.length > 0 ? (
                                <button
                                  onClick={() => openReceiptView(fee, fee.transactions[0])}
                                  className="px-3 py-1.5 bg-surface-container-high text-primary hover:bg-surface-container-highest rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  View Receipt
                                </button>
                              ) : (
                                <span className="text-xs text-secondary font-medium">Cleared</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Progress Footer */}
              <div className="px-6 py-4 border-t border-surface-container-low bg-surface-container-low/30">
                <div className="flex justify-between text-[11px] text-secondary font-bold mb-2">
                  <span>Overall Collection Rate</span>
                  <span>
                    {stats.totalCollected + stats.totalPending > 0
                      ? Math.round((stats.totalCollected / (stats.totalCollected + stats.totalPending)) * 100)
                      : 100}
                    %
                  </span>
                </div>
                <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        stats.totalCollected + stats.totalPending > 0
                          ? (stats.totalCollected / (stats.totalCollected + stats.totalPending)) * 100
                          : 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= PAYMENT GATEWAY CHECKOUT MODAL ================= */}
        {showPayModal && selectedFee && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !processing && setShowPayModal(false)} />
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-[0_40px_80px_rgba(13,28,47,0.2)] z-10 border border-surface-container-low my-8">
              <button
                onClick={() => !processing && setShowPayModal(false)}
                className="absolute top-5 right-5 text-secondary hover:text-primary p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              {/* If Payment Succeeded */}
              {paymentSuccess ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 mx-auto flex items-center justify-center animate-bounce">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                  </div>
                  <h2 className="text-2xl font-bold text-primary font-headline">Payment Successful!</h2>
                  <p className="text-secondary text-sm">
                    Transaction ID:{' '}
                    <span className="font-mono font-bold text-primary">{paymentSuccess.transaction.transactionId}</span>
                  </p>

                  <div className="bg-surface-container-low rounded-2xl p-4 text-left space-y-2 text-sm my-4">
                    <div className="flex justify-between">
                      <span className="text-secondary">Amount Paid:</span>
                      <span className="font-bold text-green-700 text-base">{fmt(paymentSuccess.transaction.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Student Name:</span>
                      <span className="font-semibold text-primary">{paymentSuccess.fee.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Remaining Due:</span>
                      <span className="font-bold text-red-600">{fmt(paymentSuccess.fee.due)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Receipt Number:</span>
                      <span className="font-mono font-semibold text-primary">{paymentSuccess.transaction.receiptNumber}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openReceiptView(paymentSuccess.fee, paymentSuccess.transaction)}
                      className="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span className="material-symbols-outlined text-base">receipt</span> View Official Receipt
                    </button>
                    <button
                      onClick={() => setShowPayModal(false)}
                      className="px-5 py-3 bg-surface-container-high rounded-xl text-sm font-semibold hover:bg-surface-container-highest cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Payment Form */
                <form onSubmit={executePayment} className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                        Secure Payment Gateway
                      </span>
                      <span className="text-xs text-secondary">256-bit SSL</span>
                    </div>
                    <h2 className="text-2xl font-bold text-primary font-headline mt-1">Pay Academic Fees</h2>
                    <p className="text-secondary text-sm">
                      {selectedFee.studentName} · {selectedFee.studentId} ({selectedFee.class})
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="grid grid-cols-2 gap-3 bg-surface-container-low rounded-2xl p-3.5">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Outstanding Due</p>
                      <p className="text-xl font-black text-red-600 font-headline mt-0.5">{fmt(selectedFee.due)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Already Paid</p>
                      <p className="text-xl font-black text-green-700 font-headline mt-0.5">{fmt(selectedFee.paid)}</p>
                    </div>
                  </div>

                  {/* Amount to Pay */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1.5">
                      Amount to Pay (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">₹</span>
                      <input
                        type="number"
                        min="1"
                        max={selectedFee.due}
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        required
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-9 pr-4 text-lg font-bold text-primary focus:ring-2 focus:ring-primary-container"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-[11px] text-secondary">Maximum payable: {fmt(selectedFee.due)}</span>
                      {Number(payAmount) !== selectedFee.due && (
                        <button
                          type="button"
                          onClick={() => setPayAmount(selectedFee.due)}
                          className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                        >
                          Pay Full Due
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Payment Method Tabs */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-1 rounded-2xl">
                      {[
                        { id: 'card', label: 'Card', icon: 'credit_card' },
                        { id: 'upi', label: 'UPI / QR', icon: 'qr_code_2' },
                        { id: 'netbanking', label: 'Net Banking', icon: 'account_balance' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPayMethod(m.id)}
                          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            payMethod === m.id ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:text-primary'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card Tab Details */}
                  {payMethod === 'card' && (
                    <div className="space-y-3 bg-surface-container-low/50 p-4 rounded-2xl border border-surface-container-low">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4242 4242 4242 4242"
                          className="w-full bg-white rounded-xl py-2.5 px-3 text-sm font-mono border border-surface-container focus:ring-2 focus:ring-primary-container"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="w-full bg-white rounded-xl py-2.5 px-3 text-sm font-mono border border-surface-container focus:ring-2 focus:ring-primary-container"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="•••"
                            className="w-full bg-white rounded-xl py-2.5 px-3 text-sm font-mono border border-surface-container focus:ring-2 focus:ring-primary-container"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Full Name"
                          className="w-full bg-white rounded-xl py-2.5 px-3 text-sm border border-surface-container focus:ring-2 focus:ring-primary-container"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* UPI Tab Details */}
                  {payMethod === 'upi' && (
                    <div className="space-y-4 bg-surface-container-low/50 p-4 rounded-2xl border border-surface-container-low text-center">
                      <div className="inline-block p-3 bg-white rounded-2xl shadow-sm border border-surface-container">
                        <div className="w-36 h-36 bg-gradient-to-br from-primary to-primary-container rounded-xl flex flex-col items-center justify-center text-white p-2">
                          <span className="material-symbols-outlined text-4xl mb-1">qr_code_2</span>
                          <span className="text-[9px] uppercase tracking-widest font-bold">Scan to Pay</span>
                          <span className="text-xs font-black mt-1">{fmt(payAmount || selectedFee.due)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-secondary font-medium">Scan with Google Pay, PhonePe, Paytm, or any UPI app</p>

                      <div className="text-left pt-2 border-t border-surface-container-low">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                          Or Enter UPI ID (VPA)
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@okaxis"
                          className="w-full bg-white rounded-xl py-2.5 px-3 text-sm border border-surface-container focus:ring-2 focus:ring-primary-container"
                        />
                      </div>
                    </div>
                  )}

                  {/* Net Banking Tab Details */}
                  {payMethod === 'netbanking' && (
                    <div className="space-y-3 bg-surface-container-low/50 p-4 rounded-2xl border border-surface-container-low">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">
                        Select Your Bank
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {POPULAR_BANKS.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBank(b.id)}
                            className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                              selectedBank === b.id
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'bg-white text-primary border-surface-container hover:bg-surface-container-high'
                            }`}
                          >
                            <span>{b.name}</span>
                            <span className="text-[10px] opacity-70 font-mono">{b.code}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      disabled={processing}
                      onClick={() => setShowPayModal(false)}
                      className="flex-1 py-3 bg-surface-container-high text-on-primary-fixed-variant rounded-xl font-semibold hover:bg-surface-container-highest transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-1 py-3 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl font-bold hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {processing ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Processing…
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-lg">lock</span>
                          Pay {fmt(payAmount || selectedFee.due)}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ================= OFFICIAL RECEIPT INVOICE MODAL ================= */}
        {showReceiptModal && receiptData && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReceiptModal(false)} />
            <div className="relative bg-white rounded-3xl p-6 sm:p-10 w-full max-w-2xl shadow-2xl z-10 border border-surface-container-low my-8">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="absolute top-5 right-5 text-secondary hover:text-primary p-1 cursor-pointer print:hidden"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              {/* Printable Invoice Header */}
              <div className="border-b-2 border-primary/20 pb-6 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">school</span>
                      </div>
                      <span className="text-xl font-black text-primary font-headline">Academic Atelier</span>
                    </div>
                    <p className="text-xs text-secondary font-medium">Directorate of Finance & Student Accounts</p>
                    <p className="text-[11px] text-secondary">Authorized Academic Institution · ISO 9001:2015</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-1">
                      Official Fee Receipt
                    </span>
                    <p className="text-xs text-secondary">Receipt No: <span className="font-mono font-bold text-primary">{receiptData.receiptNumber}</span></p>
                    <p className="text-xs text-secondary">Date: {receiptData.date}</p>
                  </div>
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-2 gap-4 bg-surface-container-low/50 p-4 rounded-2xl text-xs mb-6 border border-surface-container-low">
                <div>
                  <p className="text-secondary uppercase font-bold text-[10px]">Student Name</p>
                  <p className="text-sm font-bold text-primary mt-0.5">{receiptData.studentName}</p>
                  <p className="text-secondary mt-1">Student ID: <span className="font-semibold text-primary">{receiptData.studentId}</span></p>
                </div>
                <div>
                  <p className="text-secondary uppercase font-bold text-[10px]">Class & Section</p>
                  <p className="text-sm font-bold text-primary mt-0.5">{receiptData.class}</p>
                  <p className="text-secondary mt-1">Method: <span className="font-semibold text-primary">{receiptData.paymentMethod}</span></p>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <div className="space-y-2 mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-container text-[10px] uppercase tracking-widest text-secondary font-bold">
                      <th className="py-2 text-left">Description</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(receiptData.breakdown || []).map((b, i) => (
                      <tr key={i} className="border-b border-surface-container-low/60 text-xs">
                        <td className="py-2 text-secondary">{b.category}</td>
                        <td className="py-2 text-right font-semibold text-primary">{fmt(b.amount)}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-primary/20 text-sm font-bold">
                      <td className="pt-3 text-primary">Total Course Fees</td>
                      <td className="pt-3 text-right text-primary">{fmt(receiptData.totalFee)}</td>
                    </tr>
                    <tr className="text-sm font-bold text-green-700">
                      <td className="py-1">Total Paid</td>
                      <td className="py-1 text-right">{fmt(receiptData.totalPaid)}</td>
                    </tr>
                    <tr className="text-sm font-bold text-red-600">
                      <td className="py-1">Outstanding Balance Due</td>
                      <td className="py-1 text-right">{fmt(receiptData.outstandingDue)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Transaction Seal & Signature */}
              <div className="flex justify-between items-end pt-4 border-t border-surface-container-low">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Transaction Reference</p>
                  <p className="text-xs font-mono font-bold text-primary">{receiptData.transactionId}</p>
                  <p className="text-[10px] text-green-700 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span> Digital Signature Verified
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-28 h-10 border-b border-secondary/40 ml-auto mb-1 flex items-end justify-center">
                    <span className="text-[11px] italic font-serif text-secondary">Eleanor Vance</span>
                  </div>
                  <p className="text-[10px] uppercase font-bold text-secondary">Director of Finance</p>
                </div>
              </div>

              {/* Print / Action Buttons */}
              <div className="flex gap-3 mt-8 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-base">print</span> Print Receipt
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="px-6 py-3 bg-surface-container-high rounded-xl text-sm font-semibold hover:bg-surface-container-highest cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= ADD FEE MODAL (ADMIN/FACULTY) ================= */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl z-10">
              <button onClick={() => setShowAddModal(false)} className="absolute top-5 right-5 text-secondary hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
              <h2 className="text-2xl font-bold text-primary font-headline mb-4">Generate Student Fee</h2>
              <form onSubmit={handleAddFeeSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={newFeeForm.studentName}
                    onChange={(e) => setNewFeeForm({ ...newFeeForm, studentName: e.target.value })}
                    placeholder="e.g. Marcus Chen"
                    className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-container"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">Student ID</label>
                  <input
                    type="text"
                    value={newFeeForm.studentId}
                    onChange={(e) => setNewFeeForm({ ...newFeeForm, studentId: e.target.value })}
                    placeholder="e.g. #MC-9922"
                    className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-container"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">Class</label>
                  <select
                    value={newFeeForm.class}
                    onChange={(e) => setNewFeeForm({ ...newFeeForm, class: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-container"
                  >
                    {['Grade 10 - Section A', 'Grade 10 - Section B', 'Grade 11 - Section A', 'Grade 11 - Section B', 'Grade 12 - Section A'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">Fee Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newFeeForm.amount}
                    onChange={(e) => setNewFeeForm({ ...newFeeForm, amount: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-container"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newFeeForm.dueDate}
                    onChange={(e) => setNewFeeForm({ ...newFeeForm, dueDate: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary-container"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-surface-container-high rounded-xl text-sm font-semibold hover:bg-surface-container-highest cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 shadow-md cursor-pointer"
                  >
                    Create Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
