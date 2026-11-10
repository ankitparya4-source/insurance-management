const User = require('../models/User');
const UserPolicy = require('../models/UserPolicy');
const Claim = require('../models/Claim');

// @desc    Get dashboard analytics and platform summary stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, policiesSold, revenueAggregation, pendingClaims] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      UserPolicy.countDocuments(),
      UserPolicy.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$premiumPaid' },
          },
        },
      ]),
      Claim.countDocuments({ status: 'Pending' }),
    ]);

    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    return res.status(200).json({
      totalUsers,
      policiesSold,
      totalRevenue,
      pendingClaims,
    });
  } catch (error) {
    console.error('getAdminStats error:', error.message);
    return res.status(500).json({ message: 'Server error fetching platform statistics' });
  }
};

module.exports = {
  getAdminStats,
};

