const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Timetable = require('./models/Timetable');
const Fee = require('./models/Fee');
const Class = require('./models/Class');
const Feedback = require('./models/Feedback');
const { DEFAULT_TIMETABLES } = require('./controllers/timetableController');
const { DEFAULT_FEES } = require('./controllers/feeController');

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding database with initial users...');

      const users = await User.create([
        {
          name: 'Alex Thompson',
          email: 'alex@school.edu',
          password: 'password123',
          role: 'student',
          title: 'Grade 10 Scholar',
          studentClass: 'Grade 10 - Section A',
          studentId: '#AT-9920',
          rollNumber: '001',
          initials: 'AT',
        },
        {
          name: 'Priya Nair',
          email: 'priya@school.edu',
          password: 'password123',
          role: 'student',
          title: 'Grade 10 Scholar',
          studentClass: 'Grade 10 - Section B',
          studentId: '#PN-9924',
          rollNumber: '005',
          initials: 'PN',
        },
        {
          name: 'Sasha Petrov',
          email: 'sasha@school.edu',
          password: 'password123',
          role: 'student',
          title: 'Grade 11 Honors',
          studentClass: 'Grade 11 - Section A',
          studentId: '#SP-9923',
          rollNumber: '004',
          initials: 'SP',
        },
        {
          name: 'Dr. Julian Thorne',
          email: 'faculty@school.edu',
          password: 'password123',
          role: 'faculty',
          title: 'Studio IV Lead & Physics Chair',
          initials: 'JT',
        },
        {
          name: 'Eleanor Vance',
          email: 'admin@school.edu',
          password: 'password123',
          role: 'admin',
          title: 'Dean of Academic Affairs',
          initials: 'EV',
        },
      ]);

      console.log(`✅ Seeded ${users.length} users`);

      // Seed Feedbacks
      await Feedback.create([
        {
          from: users[3]._id, // Dr. Julian Thorne
          to: users[0]._id,   // Alex Thompson
          rating: 5,
          comment: 'Exceptional performance in Theoretical Physics thermodynamics analysis.',
          tags: ['Physics', 'Thermodynamics', 'Excellence'],
          course: 'Theoretical Physics',
          status: 'published',
        },
        {
          from: users[3]._id,
          to: users[1]._id,
          rating: 4,
          comment: 'Solid analytical skills shown during the kinematics laboratory tests.',
          tags: ['Kinematics', 'Lab Work'],
          course: 'Physics Lab',
          status: 'published',
        },
      ]);
    }

    // Seed Timetables
    const timetableCount = await Timetable.countDocuments();
    if (timetableCount === 0) {
      console.log('🌱 Seeding timetables for all classes...');
      const timetablesToCreate = Object.entries(DEFAULT_TIMETABLES).map(([className, data]) => ({
        className,
        term: 'Term 1 – 2024',
        academicYear: '2024-2025',
        schedule: data.schedule,
        room: data.room,
        classTeacher: data.classTeacher,
      }));
      await Timetable.insertMany(timetablesToCreate);
      console.log('✅ Seeded timetables for all classes');
    }

    // Seed Fees
    const feeCount = await Fee.countDocuments();
    if (feeCount === 0) {
      console.log('🌱 Seeding initial fees...');
      await Fee.insertMany(DEFAULT_FEES);
      console.log('✅ Seeded fees');
    }

    // Seed Classes
    const classCount = await Class.countDocuments();
    if (classCount === 0) {
      console.log('🌱 Seeding initial classes...');
      await Class.insertMany([
        { classId: 'CLS-001', name: 'Grade 10 - Section A', teacher: 'Dr. Julian Thorne', subject: 'Advanced Physics', students: 32, room: 'Lab 3A', schedule: 'Mon/Wed/Fri', status: 'active' },
        { classId: 'CLS-002', name: 'Grade 10 - Section B', teacher: 'Prof. Sarah Jenkins', subject: 'History of Art', students: 28, room: 'Studio 2', schedule: 'Tue/Thu', status: 'active' },
        { classId: 'CLS-003', name: 'Grade 11 - Section A', teacher: 'Ms. Priya Sharma', subject: 'Advanced Mathematics', students: 30, room: 'Room 101', schedule: 'Mon/Wed/Fri', status: 'active' },
        { classId: 'CLS-004', name: 'Grade 11 - Section B', teacher: 'Mr. Carlos Rivera', subject: 'Literature', students: 25, room: 'Room 204', schedule: 'Tue/Thu/Sat', status: 'active' },
        { classId: 'CLS-005', name: 'Grade 12 - Section A', teacher: 'Dr. Alice Merton', subject: 'Chemistry', students: 27, room: 'Lab 1B', schedule: 'Mon/Wed', status: 'inactive' },
      ]);
      console.log('✅ Seeded classes');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};

module.exports = seedDatabase;
