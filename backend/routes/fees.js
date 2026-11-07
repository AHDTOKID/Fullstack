const express = require('express');
const { getFees, recordPayment, createFee, getReceipt } = require('../controllers/feeController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getFees);
router.post('/:id/pay', protect, recordPayment);
router.post('/', protect, requireRole('faculty', 'admin'), createFee);
router.get('/:id/receipt/:txnId', protect, getReceipt);

module.exports = router;
