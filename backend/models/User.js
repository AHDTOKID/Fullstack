const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
    title: { type: String, default: '' },           // e.g. "Studio IV Lead"
    avatarUrl: { type: String, default: '' },
    initials: { type: String, default: '' },        // fallback when no avatar
    studentClass: { type: String, default: 'Grade 10 - Section A' },
    studentId: { type: String, default: '' },       // e.g. "#AT-9920"
    rollNumber: { type: String, default: '' },      // e.g. "001"
    department: { type: String, default: 'General' },
    phone: { type: String, default: '' },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password helper
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
