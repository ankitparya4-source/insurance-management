const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Policy title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Policy category is required'],
      enum: ['Health', 'Auto', 'Life', 'Home'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    basePremium: {
      type: Number,
      required: [true, 'Base premium is required'],
      min: [0, 'Base premium cannot be negative'],
    },
    coverageAmount: {
      type: Number,
      required: [true, 'Coverage amount is required'],
      min: [0, 'Coverage amount cannot be negative'],
    },
    durationInMonths: {
      type: Number,
      required: [true, 'Duration in months is required'],
      min: [1, 'Duration must be at least 1 month'],
      default: 12,
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;

