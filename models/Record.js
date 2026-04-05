const mongoose = require('mongoose');

/**
 * Financial Record Schema
 * Tracks income and expense entries linked to the creating user
 */
const recordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Type is required (income or expense)'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      lowercase: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Record must belong to a user'],
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// Improve query performance for common filter operations
recordSchema.index({ type: 1 });
recordSchema.index({ category: 1 });
recordSchema.index({ date: -1 });
recordSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Record', recordSchema);
