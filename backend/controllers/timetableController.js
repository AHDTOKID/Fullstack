const Timetable = require('../models/Timetable');

const DEFAULT_TIMETABLES = {
  'Grade 10 - Section A': {
    room: 'Lab 3A',
    classTeacher: 'Dr. Julian Thorne',
    schedule: {
      Monday:    ['Physics', 'Mathematics', 'Break', 'Chemistry', 'Literature', 'Break', 'History', 'Art & Design'],
      Tuesday:   ['Mathematics', 'Physics', 'Break', 'Literature', 'Chemistry', 'Break', 'Art & Design', 'History'],
      Wednesday: ['Chemistry', 'History', 'Break', 'Mathematics', 'Physics', 'Break', 'Literature', 'Free'],
      Thursday:  ['Literature', 'Art & Design', 'Break', 'Physics', 'Mathematics', 'Break', 'Chemistry', 'Free'],
      Friday:    ['History', 'Chemistry', 'Break', 'Art & Design', 'Literature', 'Break', 'Physics', 'Mathematics'],
      Saturday:  ['Physics', 'Mathematics', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free'],
    },
  },
  'Grade 10 - Section B': {
    room: 'Studio 2',
    classTeacher: 'Prof. Sarah Jenkins',
    schedule: {
      Monday:    ['Biology', 'English Literature', 'Break', 'Computer Science', 'Mathematics', 'Break', 'Geography', 'Art & Design'],
      Tuesday:   ['Computer Science', 'Biology', 'Break', 'Mathematics', 'English Literature', 'Break', 'History', 'Geography'],
      Wednesday: ['Mathematics', 'Geography', 'Break', 'Biology', 'Computer Science', 'Break', 'English Literature', 'Free'],
      Thursday:  ['English Literature', 'Art & Design', 'Break', 'Computer Science', 'Biology', 'Break', 'Mathematics', 'Free'],
      Friday:    ['Geography', 'Mathematics', 'Break', 'History', 'Computer Science', 'Break', 'Biology', 'English Literature'],
      Saturday:  ['Computer Science', 'Biology', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free'],
    },
  },
  'Grade 11 - Section A': {
    room: 'Room 101',
    classTeacher: 'Ms. Priya Sharma',
    schedule: {
      Monday:    ['Advanced Mathematics', 'Theoretical Physics', 'Break', 'Chemistry', 'Computer Science', 'Break', 'Literature', 'Free'],
      Tuesday:   ['Theoretical Physics', 'Advanced Mathematics', 'Break', 'Computer Science', 'Chemistry', 'Break', 'Literature', 'Physics Lab'],
      Wednesday: ['Chemistry', 'Physics Lab', 'Break', 'Theoretical Physics', 'Advanced Mathematics', 'Break', 'Computer Science', 'Free'],
      Thursday:  ['Computer Science', 'Chemistry', 'Break', 'Advanced Mathematics', 'Theoretical Physics', 'Break', 'Art & Design', 'Free'],
      Friday:    ['Advanced Mathematics', 'Theoretical Physics', 'Break', 'Physics Lab', 'Chemistry', 'Break', 'Computer Science', 'Art & Design'],
      Saturday:  ['Advanced Mathematics', 'Physics Lab', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free'],
    },
  },
  'Grade 11 - Section B': {
    room: 'Room 204',
    classTeacher: 'Mr. Carlos Rivera',
    schedule: {
      Monday:    ['Economics', 'Business Studies', 'Break', 'Accountancy', 'Mathematics', 'Break', 'History', 'Free'],
      Tuesday:   ['Accountancy', 'Economics', 'Break', 'History', 'Business Studies', 'Break', 'Mathematics', 'Literature'],
      Wednesday: ['Business Studies', 'History', 'Break', 'Economics', 'Accountancy', 'Break', 'Mathematics', 'Free'],
      Thursday:  ['Mathematics', 'Business Studies', 'Break', 'Accountancy', 'Economics', 'Break', 'Literature', 'Free'],
      Friday:    ['History', 'Accountancy', 'Break', 'Economics', 'Business Studies', 'Break', 'Mathematics', 'Art & Design'],
      Saturday:  ['Economics', 'Business Studies', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free'],
    },
  },
  'Grade 12 - Section A': {
    room: 'Lab 1B',
    classTeacher: 'Dr. Alice Merton',
    schedule: {
      Monday:    ['Theoretical Physics', 'Chemistry', 'Break', 'Advanced Mathematics', 'Literature', 'Break', 'Computer Science', 'Free'],
      Tuesday:   ['Literature', 'Theoretical Physics', 'Break', 'Chemistry', 'Advanced Mathematics', 'Break', 'Computer Science', 'Physics Lab'],
      Wednesday: ['Chemistry', 'Computer Science', 'Break', 'Theoretical Physics', 'Literature', 'Break', 'Advanced Mathematics', 'Free'],
      Thursday:  ['Advanced Mathematics', 'Chemistry', 'Break', 'Theoretical Physics', 'Literature', 'Break', 'Physics Lab', 'Free'],
      Friday:    ['Computer Science', 'Advanced Mathematics', 'Break', 'Theoretical Physics', 'Chemistry', 'Break', 'Literature', 'Free'],
      Saturday:  ['Theoretical Physics', 'Chemistry', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free'],
    },
  },
};

const CLASSES = Object.keys(DEFAULT_TIMETABLES);
const TERMS = ['Term 1 – 2024', 'Term 2 – 2024', 'Final Examination 2024'];

// GET /api/timetable
exports.getTimetable = async (req, res) => {
  try {
    const isStudent = req.user.role === 'student';
    // Students automatically get their own assigned class unless explicitly viewing another class (if permitted)
    let className = req.query.className;
    if (!className) {
      className = isStudent ? (req.user.studentClass || 'Grade 10 - Section A') : 'Grade 10 - Section A';
    }

    const term = req.query.term || 'Term 1 – 2024';

    let timetable = await Timetable.findOne({ className, term });

    // If not found in DB, seed it with default schedule for this class
    if (!timetable) {
      const template = DEFAULT_TIMETABLES[className] || DEFAULT_TIMETABLES['Grade 10 - Section A'];
      timetable = await Timetable.create({
        className,
        term,
        schedule: template.schedule,
        room: template.room,
        classTeacher: template.classTeacher,
      });
    }

    res.json({
      success: true,
      data: timetable,
      classes: CLASSES,
      terms: TERMS,
      studentInfo: isStudent
        ? {
            name: req.user.name,
            studentClass: req.user.studentClass || className,
            studentId: req.user.studentId || '',
            rollNumber: req.user.rollNumber || '',
          }
        : null,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/timetable/classes
exports.getClasses = async (req, res) => {
  res.json({
    success: true,
    classes: CLASSES,
    terms: TERMS,
  });
};

// PUT /api/timetable
exports.updateTimetable = async (req, res) => {
  try {
    const { className, term, schedule, room, classTeacher } = req.body;
    if (!className || !term || !schedule) {
      return res.status(400).json({ success: false, message: 'Class name, term, and schedule are required' });
    }

    let timetable = await Timetable.findOne({ className, term });
    if (!timetable) {
      timetable = new Timetable({ className, term });
    }

    timetable.schedule = schedule;
    if (room !== undefined) timetable.room = room;
    if (classTeacher !== undefined) timetable.classTeacher = classTeacher;
    timetable.lastUpdatedBy = req.user._id;

    await timetable.save();

    res.json({
      success: true,
      message: 'Timetable updated successfully',
      data: timetable,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports.DEFAULT_TIMETABLES = DEFAULT_TIMETABLES;
