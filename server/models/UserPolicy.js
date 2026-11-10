const mongoose = require('mongoose');

const userPolicySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    policy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Policy',
      required: [true, 'Policy reference is required'],
    },
    policyNumber: {
      type: String,
      required: [true, 'Policy number is required'],
      unique: true,
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    premiumPaid: {
      type: Number,
      required: [true, 'Premium paid is required'],
      min: [0, 'Premium cannot be negative'],
    },
    remainingCoverage: {
      type: Number,
      required: [true, 'Remaining coverage is required'],
      min: [0, 'Remaining coverage cannot be negative'],
    },
    nomineeName: {
      type: String,
      required: [true, 'Nominee name is required'],
      trim: true,
    },
    nomineeRelation: {
      type: String,
      required: [true, 'Nominee relation is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Terminated'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const UserPolicy = mongoose.model('UserPolicy', userPolicySchema);

module.exports = UserPolicy;

