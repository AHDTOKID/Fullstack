const { validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');

const ITEMS_PER_PAGE = 6;

// GET /api/feedback  – received by current user
exports.getReceived = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [items, total] = await Promise.all([
    Feedback.find({ to: req.user._id, status: 'published' })
      .populate('from', 'name title avatarUrl initials')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(ITEMS_PER_PAGE),
    Feedback.countDocuments({ to: req.user._id, status: 'published' }),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page, total, pages: Math.ceil(total / ITEMS_PER_PAGE) },
  });
};

// GET /api/feedback/given  – sent by current user
exports.getGiven = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [items, total] = await Promise.all([
    Feedback.find({ from: req.user._id })
      .populate('to', 'name title avatarUrl initials')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(ITEMS_PER_PAGE),
    Feedback.countDocuments({ from: req.user._id }),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page, total, pages: Math.ceil(total / ITEMS_PER_PAGE) },
  });
};

// GET /api/feedback/drafts
exports.getDrafts = async (req, res) => {
  const items = await Feedback.find({ from: req.user._id, status: 'draft' })
    .populate('to', 'name title avatarUrl initials')
    .sort({ updatedAt: -1 });
  res.json({ success: true, data: items });
};

// POST /api/feedback
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { to, rating, comment, tags, status, course } = req.body;

  const feedback = await Feedback.create({
    from: req.user._id,
    to,
    rating,
    comment,
    tags: tags || [],
    status: status || 'published',
    course: course || '',
  });

  await feedback.populate('from', 'name title avatarUrl initials');
  await feedback.populate('to', 'name title avatarUrl initials');

  res.status(201).json({ success: true, data: feedback });
};

// PUT /api/feedback/:id
exports.update = async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) return res.status(404).json({ success: false, message: 'Not found' });
  if (feedback.from.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorised' });
  }

  const { rating, comment, tags, status, course } = req.body;
  if (rating !== undefined) feedback.rating = rating;
  if (comment !== undefined) feedback.comment = comment;
  if (tags !== undefined) feedback.tags = tags;
  if (status !== undefined) feedback.status = status;
  if (course !== undefined) feedback.course = course;

  await feedback.save();
  await feedback.populate('from', 'name title avatarUrl initials');
  await feedback.populate('to', 'name title avatarUrl initials');

  res.json({ success: true, data: feedback });
};

// DELETE /api/feedback/:id
exports.remove = async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) return res.status(404).json({ success: false, message: 'Not found' });
  if (feedback.from.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorised' });
  }

  await feedback.deleteOne();
  res.json({ success: true, message: 'Deleted' });
};
