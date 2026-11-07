const Fee = require('../models/Fee');
const User = require('../models/User');

const DEFAULT_FEES = [
  {
    receiptId: 'FEE-001',
    studentName: 'Alex Thompson',
    studentId: '#AT-9920',
    studentEmail: 'alex@school.edu',
    class: 'Grade 10 - Section A',
    amount: 15000,
    paid: 15000,
    due: 0,
    dueDate: '2024-04-15',
    status: 'paid',
    breakdown: [
      { category: 'Tuition Fee', amount: 10000 },
      { category: 'Science Lab Fee', amount: 2500 },
      { category: 'Library & Digital Resources', amount: 1000 },
      { category: 'Examination Fee', amount: 1500 },
    ],
    transactions: [
      {
        transactionId: 'TXN-INIT-001',
        amount: 15000,
        paymentMethod: 'card',
        paymentDetails: { cardLast4: '4242', cardBrand: 'Visa', cardHolder: 'Alex Thompson' },
        paidAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        status: 'success',
        receiptNumber: 'RCP-100291',
      },
    ],
  },
  {
    receiptId: 'FEE-002',
    studentName: 'Elena Rodriguez',
    studentId: '#ER-9921',
    studentEmail: 'elena@school.edu',
    class: 'Grade 10 - Section A',
    amount: 15000,
    paid: 7500,
    due: 7500,
    dueDate: '2024-04-20',
    status: 'partial',
    breakdown: [
      { category: 'Tuition Fee', amount: 10000 },
      { category: 'Science Lab Fee', amount: 2500 },
      { category: 'Library & Digital Resources', amount: 1000 },
      { category: 'Examination Fee', amount: 1500 },
    ],
    transactions: [
      {
        transactionId: 'TXN-INIT-002',
        amount: 7500,
        paymentMethod: 'upi',
        paymentDetails: { upiId: 'elena@okhdfcbank' },
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'success',
        receiptNumber: 'RCP-100292',
      },
    ],
  },
  {
    receiptId: 'FEE-003',
    studentName: 'Marcus Chen',
    studentId: '#MC-9922',
    studentEmail: 'marcus@school.edu',
    class: 'Grade 10 - Section A',
    amount: 15000,
    paid: 0,
    due: 15000,
    dueDate: '2024-04-10',
    status: 'overdue',
    breakdown: [
      { category: 'Tuition Fee', amount: 10000 },
      { category: 'Science Lab Fee', amount: 2500 },
      { category: 'Library & Digital Resources', amount: 1000 },
      { category: 'Examination Fee', amount: 1500 },
    ],
    transactions: [],
  },
  {
    receiptId: 'FEE-004',
    studentName: 'Sasha Petrov',
    studentId: '#SP-9923',
    studentEmail: 'sasha@school.edu',
    class: 'Grade 11 - Section A',
    amount: 15000,
    paid: 15000,
    due: 0,
    dueDate: '2024-04-18',
    status: 'paid',
    breakdown: [
      { category: 'Tuition Fee', amount: 10000 },
      { category: 'Advanced Lab Fee', amount: 2500 },
      { category: 'Library & Digital Resources', amount: 1000 },
      { category: 'Examination Fee', amount: 1500 },
    ],
    transactions: [
      {
        transactionId: 'TXN-INIT-003',
        amount: 15000,
        paymentMethod: 'netbanking',
        paymentDetails: { bankName: 'State Bank of India' },
        paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        status: 'success',
        receiptNumber: 'RCP-100293',
      },
    ],
  },
  {
    receiptId: 'FEE-005',
    studentName: 'Priya Nair',
    studentId: '#PN-9924',
    studentEmail: 'priya@school.edu',
    class: 'Grade 10 - Section B',
    amount: 15000,
    paid: 0,
    due: 15000,
    dueDate: '2024-04-22',
    status: 'pending',
    breakdown: [
      { category: 'Tuition Fee', amount: 10000 },
      { category: 'Computer Lab Fee', amount: 2500 },
      { category: 'Library & Digital Resources', amount: 1000 },
      { category: 'Examination Fee', amount: 1500 },
    ],
    transactions: [],
  },
  {
    receiptId: 'FEE-006',
    studentName: 'James Wu',
    studentId: '#JW-9925',
    studentEmail: 'james@school.edu',
    class: 'Grade 10 - Section B',
    amount: 15000,
    paid: 10000,
    due: 5000,
    dueDate: '2024-04-25',
    status: 'partial',
    breakdown: [
      { category: 'Tuition Fee', amount: 10000 },
      { category: 'Computer Lab Fee', amount: 2500 },
      { category: 'Library & Digital Resources', amount: 1000 },
      { category: 'Examination Fee', amount: 1500 },
    ],
    transactions: [
      {
        transactionId: 'TXN-INIT-004',
        amount: 10000,
        paymentMethod: 'card',
        paymentDetails: { cardLast4: '8812', cardBrand: 'Mastercard', cardHolder: 'James Wu' },
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'success',
        receiptNumber: 'RCP-100294',
      },
    ],
  },
];

// Helper to seed fees if collection is empty
const ensureFeesSeeded = async () => {
  const count = await Fee.countDocuments();
  if (count === 0) {
    await Fee.insertMany(DEFAULT_FEES);
  }
};

// GET /api/fees
exports.getFees = async (req, res) => {
  try {
    await ensureFeesSeeded();

    const isStudent = req.user.role === 'student';
    let query = {};

    if (isStudent) {
      // Find fee matching this student
      query = {
        $or: [
          { student: req.user._id },
          { studentEmail: req.user.email },
          { studentName: req.user.name },
          ...(req.user.studentId ? [{ studentId: req.user.studentId }] : []),
        ],
      };

      let studentFees = await Fee.find(query).sort({ createdAt: -1 });

      // If no fee record exists for this student, auto-generate one!
      if (studentFees.length === 0) {
        const nextNum = (await Fee.countDocuments()) + 1;
        const newStudentFee = await Fee.create({
          receiptId: `FEE-00${nextNum}`,
          student: req.user._id,
          studentName: req.user.name,
          studentId: req.user.studentId || `#ST-${Math.floor(1000 + Math.random() * 9000)}`,
          studentEmail: req.user.email,
          class: req.user.studentClass || 'Grade 10 - Section A',
          amount: 15000,
          paid: 0,
          due: 15000,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending',
          breakdown: [
            { category: 'Tuition Fee', amount: 10000 },
            { category: 'Academic Resources & Lab', amount: 2500 },
            { category: 'Library Access', amount: 1000 },
            { category: 'Examination Fee', amount: 1500 },
          ],
          transactions: [],
        });
        studentFees = [newStudentFee];
      }

      const totalCollected = studentFees.reduce((s, f) => s + f.paid, 0);
      const totalPending = studentFees.reduce((s, f) => s + f.due, 0);

      return res.json({
        success: true,
        data: studentFees,
        stats: {
          totalCollected,
          totalPending,
          paidCount: studentFees.filter((f) => f.status === 'paid').length,
          overdueCount: studentFees.filter((f) => f.status === 'overdue').length,
          totalCount: studentFees.length,
        },
      });
    }

    // Faculty or Admin:
    const { filter, search, class: classFilter } = req.query;

    if (filter && filter !== 'all') {
      query.status = filter;
    }

    if (classFilter && classFilter !== 'all') {
      query.class = classFilter;
    }

    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { receiptId: { $regex: search, $options: 'i' } },
      ];
    }

    const fees = await Fee.find(query).sort({ createdAt: -1 });
    const allFees = await Fee.find({});

    const totalCollected = allFees.reduce((s, f) => s + f.paid, 0);
    const totalPending = allFees.reduce((s, f) => s + f.due, 0);
    const paidCount = allFees.filter((f) => f.status === 'paid').length;
    const overdueCount = allFees.filter((f) => f.status === 'overdue').length;

    res.json({
      success: true,
      data: fees,
      stats: {
        totalCollected,
        totalPending,
        paidCount,
        overdueCount,
        totalCount: allFees.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/fees/:id/pay – Process a Payment
exports.recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, paymentDetails } = req.body;

    const fee = await Fee.findById(id);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }

    const payAmount = Number(amount);
    if (!payAmount || isNaN(payAmount) || payAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Payment amount must be greater than zero' });
    }

    if (payAmount > fee.due) {
      return res.status(400).json({
        success: false,
        message: `Payment amount (₹${payAmount}) cannot exceed outstanding due (₹${fee.due})`,
      });
    }

    // Generate transaction details
    const timestamp = Date.now();
    const transactionId = `TXN-ACAD-${timestamp}-${Math.floor(100 + Math.random() * 900)}`;
    const receiptNumber = `RCP-${timestamp.toString().slice(-6)}`;

    const transaction = {
      transactionId,
      amount: payAmount,
      paymentMethod: paymentMethod || 'card',
      paymentDetails: {
        cardLast4: paymentDetails?.cardLast4 || (paymentMethod === 'card' ? '4242' : ''),
        cardBrand: paymentDetails?.cardBrand || (paymentMethod === 'card' ? 'Visa' : ''),
        cardHolder: paymentDetails?.cardHolder || req.user.name,
        upiId: paymentDetails?.upiId || '',
        bankName: paymentDetails?.bankName || '',
      },
      paidAt: new Date(),
      status: 'success',
      receiptNumber,
    };

    fee.paid += payAmount;
    fee.due = Math.max(0, fee.amount - fee.paid);

    if (fee.due === 0) {
      fee.status = 'paid';
    } else {
      fee.status = 'partial';
    }

    fee.transactions.unshift(transaction);
    await fee.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: fee,
      transaction,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/fees – Create Fee Record
exports.createFee = async (req, res) => {
  try {
    const { studentName, studentId, studentEmail, class: className, amount, dueDate, breakdown } = req.body;
    const count = await Fee.countDocuments();
    const receiptId = `FEE-${String(count + 1).padStart(3, '0')}`;

    const newFee = await Fee.create({
      receiptId,
      studentName,
      studentId: studentId || `#ST-${Math.floor(1000 + Math.random() * 9000)}`,
      studentEmail: studentEmail || '',
      class: className,
      amount: Number(amount),
      paid: 0,
      due: Number(amount),
      dueDate,
      status: 'pending',
      breakdown: breakdown || [{ category: 'Tuition Fee', amount: Number(amount) }],
      transactions: [],
    });

    res.status(201).json({ success: true, data: newFee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/fees/:id/receipt/:txnId
exports.getReceipt = async (req, res) => {
  try {
    const { id, txnId } = req.params;
    const fee = await Fee.findById(id);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee not found' });

    const txn = fee.transactions.find((t) => t.transactionId === txnId || t._id.toString() === txnId);
    if (!txn) return res.status(404).json({ success: false, message: 'Transaction not found' });

    res.json({
      success: true,
      data: {
        institute: 'The Academic Atelier',
        receiptNumber: txn.receiptNumber,
        transactionId: txn.transactionId,
        date: txn.paidAt,
        studentName: fee.studentName,
        studentId: fee.studentId,
        class: fee.class,
        paymentMethod: txn.paymentMethod,
        paymentDetails: txn.paymentDetails,
        amountPaid: txn.amount,
        totalFee: fee.amount,
        totalPaid: fee.paid,
        outstandingDue: fee.due,
        status: 'PAID',
        breakdown: fee.breakdown,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports.DEFAULT_FEES = DEFAULT_FEES;
