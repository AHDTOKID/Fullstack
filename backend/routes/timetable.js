const express = require('express');
const { getTimetable, getClasses, updateTimetable } = require('../controllers/timetableController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getTimetable);
router.get('/classes', protect, getClasses);
router.put('/', protect, requireRole('faculty', 'admin'), updateTimetable);

module.exports = router;
