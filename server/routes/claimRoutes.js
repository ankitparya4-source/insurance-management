const express = require('express');
const router = express.Router();
const {
  fileClaim,
  getMyClaims,
  getAllClaims,
  updateClaimStatus,
} = require('../controllers/claimController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, fileClaim);
router.get('/my', protect, getMyClaims);
router.get('/all', protect, adminOnly, getAllClaims);
router.put('/:id/status', protect, adminOnly, updateClaimStatus);

module.exports = router;

