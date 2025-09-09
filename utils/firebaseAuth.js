const admin = require('../config/firebase');

// Verify Firebase ID Token
exports.verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return { success: true, decodedToken };
  } catch (error) {
    console.error('Firebase token verification error:', error);
    return { 
      success: false, 
      error: 'Invalid or expired OTP. Please try again.' 
    };
  }
};

// Get user data from Firebase
exports.getFirebaseUser = async (uid) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return { success: true, userRecord };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Create custom token (optional - for advanced use cases)
exports.createCustomToken = async (uid) => {
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    return { success: true, customToken };
  } catch (error) {
    return { success: false, error: error.message };
  }
};