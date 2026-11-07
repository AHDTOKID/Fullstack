const mongoose = require('mongoose');

const studentMarkSchema = new mongoose.Schema({
  roll: { type: String, required: true },
  studentName: { type: String, required: true },
  studentId: { type: String, required: true },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['present', 'absent'], default: 'present' },
  marks: { type: String, default: '' },
  remarks: { type: String, default: '' },
});

const academicRecordSchema = new mongoose.Schema(
  {
    className: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    term: { type: String, default: 'Final Examination 2024' },
    academicYear: { type: String, default: '2024-2025' },
    maxMarks: { type: Number, default: 100 },
    records: [studentMarkSchema],
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Compound index so each class + subject + term is unique
academicRecordSchema.index({ className: 1, subject: 1, term: 1 }, { unique: true });

module.exports = mongoose.model('AcademicRecord', academicRecordSchema);
