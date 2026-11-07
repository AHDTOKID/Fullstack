const express = require('express');
const Class = require('../models/Class');
const User = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

const DEFAULT_CLASSES = [
  { classId: 'CLS-001', name: 'Grade 10 - Section A', teacher: 'Dr. Julian Thorne', subject: 'Advanced Physics', students: 32, room: 'Lab 3A', schedule: 'Mon/Wed/Fri', status: 'active' },
  { classId: 'CLS-002', name: 'Grade 10 - Section B', teacher: 'Prof. Sarah Jenkins', subject: 'History of Art', students: 28, room: 'Studio 2', schedule: 'Tue/Thu', status: 'active' },
  { classId: 'CLS-003', name: 'Grade 11 - Section A', teacher: 'Ms. Priya Sharma', subject: 'Advanced Mathematics', students: 30, room: 'Room 101', schedule: 'Mon/Wed/Fri', status: 'active' },
  { classId: 'CLS-004', name: 'Grade 11 - Section B', teacher: 'Mr. Carlos Rivera', subject: 'Literature', students: 25, room: 'Room 204', schedule: 'Tue/Thu/Sat', status: 'active' },
  { classId: 'CLS-005', name: 'Grade 12 - Section A', teacher: 'Dr. Alice Merton', subject: 'Chemistry', students: 27, room: 'Lab 1B', schedule: 'Mon/Wed', status: 'inactive' },
];

router.get('/', protect, async (req, res) => {
  try {
    const count = await Class.countDocuments();
    if (count === 0) {
      await Class.insertMany(DEFAULT_CLASSES);
    }
    const classes = await Class.find().sort({ classId: 1 });
    const students = await User.find({ role: 'student' }).select('name email studentId studentClass rollNumber createdAt');

    res.json({ success: true, data: classes, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, requireRole('faculty', 'admin'), async (req, res) => {
  try {
    const { name, teacher, subject, room, schedule } = req.body;
    const count = await Class.countDocuments();
    const classId = `CLS-${String(count + 1).padStart(3, '0')}`;

    const newClass = await Class.create({
      classId,
      name,
      teacher,
      subject,
      room,
      schedule,
      students: 0,
      status: 'active',
    });

    res.status(201).json({ success: true, data: newClass });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
