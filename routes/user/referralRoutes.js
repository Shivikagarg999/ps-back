const express = require("express");
const { generateReferralCode, getReferralCode, applyReferral } = require("../../controllers/userController/referral");
const protect  = require("../../middlewares/auth");

const router = express.Router();

// Generate a referral code (one-time)
router.post("/generate", protect, generateReferralCode);

// Get my referral code + wallet balance
router.get("/my-code", protect, getReferralCode);

// Apply someone else’s referral code
router.post("/apply", protect, applyReferral);

module.exports = router;
