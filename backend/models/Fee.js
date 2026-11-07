const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'cash'],
    default: 'card',
  },
  paymentDetails: {
    cardLast4: { type: String, default: '' },
    cardBrand: { type: String, default: '' },
    cardHolder: { type: String, default: '' },
    upiId: { type: String, default: '' },
    bankName: { type: String, default: '' },
  },
  paidAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'failed'], default: 'success' },
  receiptNumber: { type: String, default: '' },
});

const feeSchema = new mongoose.Schema(
  {
    receiptId: { type: String, required: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    studentName: { type: String, required: true },
    studentId: { type: String, required: true },
    studentEmail: { type: String, default: '' },
    class: { type: String, required: true },
    academicYear: { type: String, default: '2024-2025' },
    term: { type: String, default: 'Term 1 – 2024' },
    breakdown: [
      {
        category: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    paid: { type: Number, default: 0 },
    due: { type: Number, required: true },
    dueDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['paid', 'partial', 'pending', 'overdue'],
      default: 'pending',
    },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fee', feeSchema);
