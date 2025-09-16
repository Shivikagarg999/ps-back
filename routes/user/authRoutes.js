const express = require("express");
const { register, login, getProfile, updateProfile } = require("../../controllers/userController/auth");
const router = express.Router();
const auth = require('../../middlewares/auth');

router.post("/register", register);
router.post("/login", login);

// Get logged-in user profile
router.get("/profile", auth, getProfile);

// Update logged-in user profile
router.put("/profile", auth, updateProfile);

module.exports = router;