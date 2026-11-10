const Policy = require('../models/Policy');

// @desc    Get all active policies (optional category filter, optional includeInactive for admin)
// @route   GET /api/policies
// @access  Public
const getPolicies = async (req, res) => {
  try {
    const { category, includeInactive } = req.query;
    const filter = {};

    // Filter by active status unless includeInactive=true is requested
    if (includeInactive !== 'true') {
      filter.isActive = true;
    }

    // Filter by category if specified and not 'All'
    if (category && category !== 'All') {
      filter.category = category;
    }

    const policies = await Policy.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(policies);
  } catch (error) {
    console.error('getPolicies error:', error.message);
    return res.status(500).json({ message: 'Server error fetching policies' });
  }
};

// @desc    Get single policy details
// @route   GET /api/policies/:id
// @access  Public
const getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    return res.status(200).json(policy);
  } catch (error) {
    console.error('getPolicyById error:', error.message);
    return res.status(500).json({ message: 'Server error fetching policy details' });
  }
};

// @desc    Create a new policy
// @route   POST /api/policies
// @access  Private/Admin
const createPolicy = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      basePremium,
      coverageAmount,
      durationInMonths,
      features,
    } = req.body;

    if (!title || !category || basePremium === undefined || !coverageAmount || !durationInMonths) {
      return res.status(400).json({ message: 'Please provide all required policy fields' });
    }

    const policy = await Policy.create({
      title: title.trim(),
      category,
      description: description ? description.trim() : '',
      basePremium: Number(basePremium),
      coverageAmount: Number(coverageAmount),
      durationInMonths: Number(durationInMonths),
      features: Array.isArray(features) ? features : [],
      isActive: true,
    });

    return res.status(201).json(policy);
  } catch (error) {
    console.error('createPolicy error:', error.message);
    return res.status(500).json({ message: 'Server error creating policy' });
  }
};

// @desc    Update existing policy
// @route   PUT /api/policies/:id
// @access  Private/Admin
const updatePolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    const {
      title,
      category,
      description,
      basePremium,
      coverageAmount,
      durationInMonths,
      features,
      isActive,
    } = req.body;

    if (title !== undefined) policy.title = title.trim();
    if (category !== undefined) policy.category = category;
    if (description !== undefined) policy.description = description.trim();
    if (basePremium !== undefined) policy.basePremium = Number(basePremium);
    if (coverageAmount !== undefined) policy.coverageAmount = Number(coverageAmount);
    if (durationInMonths !== undefined) policy.durationInMonths = Number(durationInMonths);
    if (features !== undefined) policy.features = Array.isArray(features) ? features : [];
    if (isActive !== undefined) policy.isActive = Boolean(isActive);

    const updatedPolicy = await policy.save();
    return res.status(200).json(updatedPolicy);
  } catch (error) {
    console.error('updatePolicy error:', error.message);
    return res.status(500).json({ message: 'Server error updating policy' });
  }
};

// @desc    Deactivate policy (soft delete - sets isActive=false)
// @route   DELETE /api/policies/:id
// @access  Private/Admin
const deactivatePolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    policy.isActive = false;
    await policy.save();

    return res.status(200).json({
      message: 'Policy deactivated successfully',
      policy,
    });
  } catch (error) {
    console.error('deactivatePolicy error:', error.message);
    return res.status(500).json({ message: 'Server error deactivating policy' });
  }
};

module.exports = {
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deactivatePolicy,
};

