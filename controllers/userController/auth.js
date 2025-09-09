const User = require('../../models/user/user');
const { verifyIdToken } = require('../../utils/firebaseAuth');

// @desc    Verify OTP and Register/Login user
// @route   POST /api/user/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
  try {
    const { idToken, name } = req.body;

    console.log('Received verify OTP request');

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required'
      });
    }

    // Verify Firebase ID token
    const verificationResult = await verifyIdToken(idToken);
    if (!verificationResult.success) {
      return res.status(401).json({
        success: false,
        message: verificationResult.error || 'Invalid OTP'
      });
    }

    const { decodedToken } = verificationResult;
    const firebaseUID = decodedToken.uid;
    const phoneNumber = decodedToken.phone_number;

    console.log('Firebase verification successful for:', phoneNumber);

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [{ firebaseUID }, { phone: phoneNumber }] 
    });

    if (user) {
      // User exists - Login
      console.log('User found, logging in:', user.phone);
      const token = user.getSignedJwtToken();
      
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            phone: user.phone,
            profileCompleted: user.profileCompleted
          }
        }
      });
    } else {
      // New user - Register
      console.log('New user, creating account for:', phoneNumber);
      user = await User.create({
        firebaseUID,
        phone: phoneNumber,
        name: name || '', // Name is optional during registration
        profileCompleted: !!name // Profile is complete if name is provided
      });

      const token = user.getSignedJwtToken();

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            phone: user.phone,
            profileCompleted: user.profileCompleted
          }
        }
      });
    }
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    
    // Handle duplicate phone number error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this phone number'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.'
    });
  }
};

// @desc    Complete user profile
// @route   PUT /api/user/auth/complete-profile
// @access  Private
exports.completeProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        name, 
        email,
        profileCompleted: true 
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile completed successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/user/auth/me
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          profileCompleted: user.profileCompleted
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};