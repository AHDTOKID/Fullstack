const express = require('express');
const { body } = require('express-validator');
const {
  getReceived,
  getGiven,
  getDrafts,
  create,
  update,
  remove,
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getReceived);
router.get('/given', getGiven);
router.get('/drafts', getDrafts);

router.post(
  '/',
  [
    body('to').notEmpty().withMessage('Recipient is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
    body('comment').notEmpty().withMessage('Comment is required'),
  ],
  create
);

router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
