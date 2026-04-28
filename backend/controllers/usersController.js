const User = require('../models/User');

// GET /api/users  – list all users (for recipient dropdown)
exports.getAll = async (req, res) => {
  const users = await User.find({}, 'name title role avatarUrl initials').sort('name');
  res.json({ success: true, data: users });
};

// GET /api/users/:id
exports.getOne = async (req, res) => {
  const user = await User.findById(req.params.id, '-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
};

// PUT /api/users/me  – update own profile
exports.updateMe = async (req, res) => {
  const { name, title, avatarUrl } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ success: false, message: 'Not found' });

  if (name) {
    user.name = name;
    user.initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  if (title !== undefined) user.title = title;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

  await user.save();
  res.json({ success: true, data: user });
};
