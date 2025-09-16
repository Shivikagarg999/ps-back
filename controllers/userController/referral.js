const User = require("../../models/user/user");

// Generate Referral Code (only once after login)
exports.generateReferralCode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.referralCode) {
      return res.status(400).json({ success: false, message: "Referral code already generated" });
    }

    // simple unique code (last 6 chars of userId)
    const newCode = req.user._id.toString().slice(-6).toUpperCase();

    user.referralCode = newCode;
    await user.save();

    res.json({ success: true, referralCode: newCode });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get My Referral Code & Wallet
exports.getReferralCode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("referralCode wallet");
    res.json({
      success: true,
      referralCode: user.referralCode || null,
      wallet: user.wallet
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Apply Friend’s Referral Code
exports.applyReferral = async (req, res) => {
  try {
    const { referralCode } = req.body;
    const user = await User.findById(req.user._id);

    if (user.referredBy) {
      return res.status(400).json({ success: false, message: "Referral already applied" });
    }

    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(404).json({ success: false, message: "Invalid referral code" });
    }

    if (referrer._id.toString() === user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot use your own code" });
    }

    // Rewards
    user.referredBy = referrer._id;
    user.wallet += 25;     // new user bonus
    referrer.wallet += 20; // referrer bonus

    await user.save();
    await referrer.save();

    res.json({
      success: true,
      message: "Referral applied successfully",
      yourWallet: user.wallet
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
