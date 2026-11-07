const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    classId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    teacher: { type: String, required: true },
    subject: { type: String, required: true },
    students: { type: Number, default: 30 },
    room: { type: String, default: 'Room 101' },
    schedule: { type: String, default: 'Mon/Wed/Fri' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);
