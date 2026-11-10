const UserPolicy = require('../models/UserPolicy');
const Policy = require('../models/Policy');

// Helper to check and mark expired policies on read (per PRD 1.4)
const checkAndExpire = async (userPolicies) => {
  const now = new Date();
  for (const up of userPolicies) {
    if (up.status === 'Active' && new Date(up.endDate) < now) {
      up.status = 'Expired';
      await up.save();
    }
  }
};

// @desc    Purchase an insurance policy (simulated checkout)
// @route   POST /api/user-policies/purchase
// @access  Private/Customer
const purchasePolicy = async (req, res) => {
  try {
    const { policyId, nomineeName, nomineeRelation, multiplier } = req.body;

    if (!policyId || !nomineeName || !nomineeRelation) {
      return res.status(400).json({ message: 'Please provide policy, nominee name, and relation' });
    }

    const policy = await Policy.findById(policyId);
    if (!policy || !policy.isActive) {
      return res.status(404).json({ message: 'Policy is not available for purchase' });
    }

    const coverageMultiplier = Number(multiplier) > 0 ? Number(multiplier) : 1;
    const premiumPaid = Math.round(policy.basePremium * coverageMultiplier);
    const initialCoverage = Math.round(policy.coverageAmount * coverageMultiplier);

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + policy.durationInMonths);

    // Generate unique policy number: POL-2026-XXXX
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const policyNumber = `POL-${year}-${randomSuffix}`;

    const userPolicy = await UserPolicy.create({
      user: req.user._id,
      policy: policy._id,
      policyNumber,
      startDate,
      endDate,
      premiumPaid,
      remainingCoverage: initialCoverage,
      nomineeName: nomineeName.trim(),
      nomineeRelation: nomineeRelation.trim(),
      status: 'Active',
    });

    const populated = await UserPolicy.findById(userPolicy._id).populate('policy');
    return res.status(201).json(populated);
  } catch (error) {
    console.error('purchasePolicy error:', error.message);
    return res.status(500).json({ message: 'Server error processing purchase' });
  }
};

// @desc    Get all policies purchased by the logged-in customer
// @route   GET /api/user-policies/my
// @access  Private/Customer
const getMyPolicies = async (req, res) => {
  try {
    const policies = await UserPolicy.find({ user: req.user._id })
      .populate('policy')
      .sort({ createdAt: -1 });

    await checkAndExpire(policies);

    return res.status(200).json(policies);
  } catch (error) {
    console.error('getMyPolicies error:', error.message);
    return res.status(500).json({ message: 'Server error fetching your policies' });
  }
};

// @desc    Get all purchased policies across all customers
// @route   GET /api/user-policies/all
// @access  Private/Admin
const getAllUserPolicies = async (req, res) => {
  try {
    const policies = await UserPolicy.find()
      .populate('user', 'name email phone')
      .populate('policy')
      .sort({ createdAt: -1 });

    await checkAndExpire(policies);

    return res.status(200).json(policies);
  } catch (error) {
    console.error('getAllUserPolicies error:', error.message);
    return res.status(500).json({ message: 'Server error fetching all policies' });
  }
};

module.exports = {
  purchasePolicy,
  getMyPolicies,
  getAllUserPolicies,
};

