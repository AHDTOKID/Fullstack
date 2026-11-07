const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    className: { type: String, required: true, trim: true },
    term: { type: String, required: true, default: 'Term 1 – 2024' },
    academicYear: { type: String, default: '2024-2025' },
    schedule: {
      Monday: { type: [String], default: [] },
      Tuesday: { type: [String], default: [] },
      Wednesday: { type: [String], default: [] },
      Thursday: { type: [String], default: [] },
      Friday: { type: [String], default: [] },
      Saturday: { type: [String], default: [] },
    },
    room: { type: String, default: '' },
    classTeacher: { type: String, default: '' },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Unique timetable per class and term
timetableSchema.index({ className: 1, term: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);
