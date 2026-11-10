const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    userPolicy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserPolicy',
      required: [true, 'User policy reference is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    claimNumber: {
      type: String,
      required: [true, 'Claim number is required'],
      unique: true,
      trim: true,
    },
    incidentDate: {
      type: Date,
      required: [true, 'Incident date is required'],
    },
    claimAmount: {
      type: Number,
      required: [true, 'Claim amount is required'],
      min: [1, 'Claim amount must be greater than 0'],
    },
    reason: {
      type: String,
      required: [true, 'Reason for claim is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    adminRemarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Claim = mongoose.model('Claim', claimSchema);

module.exports = Claim;

