const express = require('express');
const router = express.Router();
const otpController = require('../../controllers/userController/otp');

router.get('/check-phone/:phone', otpController.checkPhone);
router.post('/reset-password', otpController.verifyAndResetPassword);

module.exports = router;