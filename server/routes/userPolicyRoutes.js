const express = require('express');
const router = express.Router();
const {
  purchasePolicy,
  getMyPolicies,
  getAllUserPolicies,
} = require('../controllers/userPolicyController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/purchase', protect, purchasePolicy);
router.get('/my', protect, getMyPolicies);
router.get('/all', protect, adminOnly, getAllUserPolicies);

module.exports = router;

