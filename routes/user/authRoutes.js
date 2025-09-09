const express = require('express');
const {
  verifyOTP,
  completeProfile,
  getProfile
} = require('../../controllers/userController/auth');
// const { protect } = require('../../middleware/auth');

const router = express.Router();

router.post('/verify-otp', verifyOTP);
// router.put('/complete-profile', protect, completeProfile);
// router.get('/profile', protect, getProfile);

module.exports = router;