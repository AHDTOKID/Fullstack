const express = require('express');
const { getRecords, saveRecords, getMyRecords } = require('../controllers/recordController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getRecords);
router.get('/my', protect, getMyRecords);
router.post('/', protect, requireRole('faculty', 'admin'), saveRecords);

module.exports = router;
