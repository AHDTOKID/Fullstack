const express = require('express');
const { getAll, getOne, updateMe } = require('../controllers/usersController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getAll);
router.get('/:id', getOne);
router.put('/me', updateMe);

module.exports = router;
