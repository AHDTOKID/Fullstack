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
  const { name, title, avatarUrl, studentClass, phone, rollNumber } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ success: false, message: 'Not found' });

  if (name) {
    user.name = name;
    user.initials = name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  if (title !== undefined) user.title = title;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  if (studentClass !== undefined) user.studentClass = studentClass;
  if (phone !== undefined) user.phone = phone;
  if (rollNumber !== undefined) user.rollNumber = rollNumber;

  await user.save();
  res.json({ success: true, data: user });
};

// PUT /api/users/password – Change password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
  }

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Incorrect current password' });
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated successfully' });
};
