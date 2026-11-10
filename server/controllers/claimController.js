const Claim = require('../models/Claim');
const UserPolicy = require('../models/UserPolicy');

// @desc    File a new insurance claim
// @route   POST /api/claims
// @access  Private/Customer
const fileClaim = async (req, res) => {
  try {
    const { userPolicyId, incidentDate, claimAmount, reason } = req.body;

    if (!userPolicyId || !incidentDate || !claimAmount || !reason) {
      return res.status(400).json({ message: 'Please provide all required claim details' });
    }

    const userPolicy = await UserPolicy.findById(userPolicyId);
    if (!userPolicy) {
      return res.status(404).json({ message: 'Purchased policy not found' });
    }

    // Enforce ownership: only the policy owner can file a claim
    if (userPolicy.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to file a claim on this policy' });
    }

    // Enforce Rule 1: Can only file claims on Active policies
    if (userPolicy.status !== 'Active') {
      return res.status(400).json({ message: 'Claims can only be filed against active policies' });
    }

    const amount = Number(claimAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Claim amount must be a positive number' });
    }

    // Enforce Rule 2: Claim amount cannot exceed remaining coverage
    if (amount > userPolicy.remainingCoverage) {
      return res.status(400).json({
        message: `Claim amount cannot exceed remaining coverage of ₹${userPolicy.remainingCoverage}`,
      });
    }

    // Generate unique claim number: CLM-2026-XXXX
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const claimNumber = `CLM-${year}-${randomSuffix}`;

    const claim = await Claim.create({
      userPolicy: userPolicy._id,
      user: req.user._id,
      claimNumber,
      incidentDate,
      claimAmount: amount,
      reason: reason.trim(),
      status: 'Pending',
    });

    const populated = await Claim.findById(claim._id).populate({
      path: 'userPolicy',
      populate: { path: 'policy' },
    });

    return res.status(201).json(populated);
  } catch (error) {
    console.error('fileClaim error:', error.message);
    return res.status(500).json({ message: 'Server error filing claim' });
  }
};

// @desc    Get all claims filed by the logged-in customer
// @route   GET /api/claims/my
// @access  Private/Customer
const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user._id })
      .populate({
        path: 'userPolicy',
        populate: { path: 'policy' },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(claims);
  } catch (error) {
    console.error('getMyClaims error:', error.message);
    return res.status(500).json({ message: 'Server error fetching your claims' });
  }
};

// @desc    Get all claims across the platform
// @route   GET /api/claims/all
// @access  Private/Admin
const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate('user', 'name email phone')
      .populate({
        path: 'userPolicy',
        populate: { path: 'policy' },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(claims);
  } catch (error) {
    console.error('getAllClaims error:', error.message);
    return res.status(500).json({ message: 'Server error fetching all claims' });
  }
};

// @desc    Approve or reject a claim (deducts coverage on approval)
// @route   PUT /api/claims/:id/status
// @access  Private/Admin
const updateClaimStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either Approved or Rejected' });
    }

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Enforce Rule 4: Claim status cannot be reversed once set
    if (claim.status !== 'Pending') {
      return res.status(400).json({
        message: `Claim has already been finalized as '${claim.status}' and cannot be modified`,
      });
    }

    // Enforce Rule 3: Deduct coverage from UserPolicy if Approved
    if (status === 'Approved') {
      const userPolicy = await UserPolicy.findById(claim.userPolicy);
      if (!userPolicy) {
        return res.status(404).json({ message: 'Associated purchased policy not found' });
      }

      if (userPolicy.remainingCoverage < claim.claimAmount) {
        return res.status(400).json({
          message: 'Cannot approve: claim amount exceeds policy remaining coverage',
        });
      }

      // Deduct coverage from policy first
      userPolicy.remainingCoverage = Math.max(0, userPolicy.remainingCoverage - claim.claimAmount);
      await userPolicy.save();
    }

    // Update the claim status
    claim.status = status;
    if (adminRemarks !== undefined) {
      claim.adminRemarks = adminRemarks.trim();
    }
    await claim.save();

    const populated = await Claim.findById(claim._id)
      .populate('user', 'name email phone')
      .populate({
        path: 'userPolicy',
        populate: { path: 'policy' },
      });

    return res.status(200).json(populated);
  } catch (error) {
    console.error('updateClaimStatus error:', error.message);
    return res.status(500).json({ message: 'Server error updating claim status' });
  }
};

module.exports = {
  fileClaim,
  getMyClaims,
  getAllClaims,
  updateClaimStatus,
};

