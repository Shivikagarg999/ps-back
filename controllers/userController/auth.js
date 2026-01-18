require('dotenv').config();

const User = require('../../models/user/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const admin = require('../../config/firebase');


exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, referralCode } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ msg: "Phone already registered" });
    }

    let referredBy = null;
    if (referralCode) {
      const referringUser = await User.findOne({ referralCode });
      if (referringUser) {
        referredBy = referringUser._id;
      }
    }

    const user = new User({
      name,
      email,
      phone,
      password,
      referredBy
    });

    await user.save();

    res.status(201).json({
      msg: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
      return res.status(400).json({ msg: "Email or phone and password are required" });
    }

    let user;
    if (email) {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );


    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: "ID Token is required" });
    }

    // Verify the ID token using Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not found
      // We don't have a phone number yet, so it will be null
      user = new User({
        name,
        email,
        googleId: uid,
        phone: null, // User might need to provide this later
      });
      await user.save();
    } else {
      // If user exists but doesn't have a googleId, update it
      if (!user.googleId) {
        user.googleId = uid;
        await user.save();
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    res.status(200).json({
      success: true,
      msg: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isNewUser: !user.phone // Suggests they might need to update their profile with a phone number
      }
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(401).json({ success: false, message: "Invalid Google token", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User with this email not found" });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000,
      socketTimeout: 10000
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const resetUrl = `${baseUrl}/api/user/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested a password reset for your account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    console.log('Server response:', info.response);

    res.json({ msg: "Password reset email sent successfully" });

  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ msg: "Failed to send reset email: " + err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: "Password reset successfully" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('favorites');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.body.addresses) {
      user.addresses = req.body.addresses;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses,
        favorites: updatedUser.favorites
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Account deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update FCM Token
// @route   PATCH /api/user/fcm-token
// @access  Private
exports.updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;

    await User.findByIdAndUpdate(req.user.id, { fcmToken });

    res.status(200).json({
      success: true,
      message: "FCM Token updated successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};