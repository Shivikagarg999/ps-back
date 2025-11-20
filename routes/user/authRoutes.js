const express = require('express');
const router = express.Router();
const authController = require('../../controllers/userController/auth');
const auth = require('../../middlewares/auth');
const User= require('../../models/user/user');

router.post('/register', authController.register);
router.post('/login', authController.login);
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
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.delete('/delete-account', auth, authController.deleteMyAccount);

module.exports = router;