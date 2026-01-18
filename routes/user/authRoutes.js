const express = require('express');
const router = express.Router();
const authController = require('../../controllers/userController/auth');
const auth = require('../../middlewares/auth');
const User = require('../../models/user/user');

/**
 * @swagger
 * tags:
 *   name: User Auth
 *   description: User registration and authentication
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               referralCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/user/create-admin:
 *   post:
 *     summary: Create a new admin user (Secure)
 *     tags: [User Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, password, adminSecretKey]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               adminSecretKey:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       401:
 *         description: Unauthorized - Invalid secret key
 */
router.post('/create-admin', authController.createAdmin);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/user/google-login:
 *   post:
 *     summary: Login or Register using Google
 *     tags: [User Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Firebase Google ID Token
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid token
 */
router.post('/google-login', authController.googleLogin);


// Password Reset Link Display Route (renders HTML)
router.get('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invalid Reset Link</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; text-align: center; }
                .error { color: #d32f2f; background: #ffebee; padding: 20px; border-radius: 8px; }
                .success { color: #388e3c; background: #e8f5e9; padding: 20px; border-radius: 8px; }
            </style>
        </head>
        <body>
            <div class="error">
                <h2>Invalid or Expired Link</h2>
                <p>This password reset link is invalid or has expired.</p>
                <p>Please request a new password reset link.</p>
            </div>
        </body>
        </html>
      `);
        }

        // Show reset password form
        res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Reset Password</title>
          <style>
              body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; }
              .container { border: 1px solid #ddd; padding: 30px; border-radius: 8px; }
              input, button { width: 100%; padding: 12px; margin: 10px 0; box-sizing: border-box; }
              input { border: 1px solid #ddd; border-radius: 4px; }
              button { background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
              button:hover { background: #0056b3; }
              .message { margin: 15px 0; padding: 10px; border-radius: 4px; }
              .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
              .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Reset Your Password</h2>
              <p>Please enter your new password below.</p>
              
              <form id="resetForm">
                  <input type="password" id="newPassword" placeholder="Enter new password" minlength="6" required>
                  <input type="password" id="confirmPassword" placeholder="Confirm new password" minlength="6" required>
                  <button type="submit">Reset Password</button>
              </form>
              
              <div id="message"></div>
          </div>

          <script>
              document.getElementById('resetForm').addEventListener('submit', async (e) => {
                  e.preventDefault();
                  
                  const password = document.getElementById('newPassword').value;
                  const confirmPassword = document.getElementById('confirmPassword').value;
                  const messageDiv = document.getElementById('message');
                  
                  // Basic validation
                  if (password !== confirmPassword) {
                      messageDiv.innerHTML = '<div class="error">Passwords do not match</div>';
                      return;
                  }
                  
                  if (password.length < 6) {
                      messageDiv.innerHTML = '<div class="error">Password must be at least 6 characters</div>';
                      return;
                  }
                  
                  try {
                      const response = await fetch('/api/user/reset-password/${token}', {
                          method: 'POST',
                          headers: { 
                              'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ password })
                      });
                      
                      const result = await response.json();
                      
                      if (response.ok) {
                          messageDiv.innerHTML = '<div class="success">Password reset successfully! You can now login with your new password.</div>';
                          document.getElementById('resetForm').reset();
                          document.getElementById('resetForm').style.display = 'none';
                      } else {
                          messageDiv.innerHTML = '<div class="error">Error: ' + result.msg + '</div>';
                      }
                  } catch (error) {
                      messageDiv.innerHTML = '<div class="error">Network error. Please try again.</div>';
                  }
              });
          </script>
      </body>
      </html>
    `);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /api/user/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags: [User Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @swagger
 * /api/user/reset-password/{token}:
 *   post:
 *     summary: Reset password with token
 *     tags: [User Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post('/reset-password/:token', authController.resetPassword);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *   put:
 *     summary: Update user profile
 *     tags: [User Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);

/**
 * @swagger
 * /api/user/delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [User Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deleted
 */
/**
 * @swagger
 * /api/user/fcm-token:
 *   patch:
 *     summary: Update FCM device token for push notifications
 *     tags: [User Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fcmToken]
 *             properties:
 *               fcmToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token updated
 */
router.patch('/fcm-token', auth, authController.updateFcmToken);

module.exports = router;