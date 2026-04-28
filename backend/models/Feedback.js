const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    course: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

// Indexes for common queries
feedbackSchema.index({ to: 1, createdAt: -1 });
feedbackSchema.index({ from: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
