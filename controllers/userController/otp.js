const admin = require('../../config/firebase');
const User = require('../../models/user/user');
const bcrypt = require('bcryptjs');

exports.checkPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        message: "Phone number is required" 
      });
    }

    const user = await User.findOne({ phone }).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        exists: false,
        message: "No account found with this phone number" 
      });
    }

    res.status(200).json({ 
      success: true, 
      exists: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

exports.verifyAndResetPassword = async (req, res) => {
  try {
    const { idToken, newPassword, phone } = req.body;

    if (!idToken || !newPassword || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: "ID token, phone, and new password are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters" 
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const tokenPhoneNumber = decodedToken.phone_number;

    if (!tokenPhoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "Phone number not found in verification token" 
      });
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    if (tokenPhoneNumber !== formattedPhone) {
      return res.status(400).json({ 
        success: false, 
        message: "Phone number verification failed" 
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Password reset successfully" 
    });

  } catch (error) {
    console.error('Password reset error:', error);

    if (error.code === 'auth/id-token-expired') {
      return res.status(400).json({ 
        success: false, 
        message: "Verification session expired. Please request a new OTP." 
      });
    }

    if (error.code === 'auth/invalid-id-token') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid verification. Please try again." 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: "Error resetting password" 
    });
  }
};