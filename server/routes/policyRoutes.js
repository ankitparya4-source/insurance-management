const express = require('express');
const router = express.Router();
const {
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deactivatePolicy,
} = require('../controllers/policyController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getPolicies);
router.get('/:id', getPolicyById);
router.post('/', protect, adminOnly, createPolicy);
router.put('/:id', protect, adminOnly, updatePolicy);
router.delete('/:id', protect, adminOnly, deactivatePolicy);

module.exports = router;

