const express = require('express');
const router = express.Router();
const { register, login } = require('../../controllers/userController/auth');
const authMiddleware = require('../../middlewares/userAuth');

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;