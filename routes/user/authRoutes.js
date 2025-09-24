const express = require("express");
const { register, login, getProfile, updateProfile, getAllUsers, createUser, getUserById, updateUser, deleteUser } = require("../../controllers/userController/auth");
const router = express.Router();
const auth = require('../../middlewares/auth');

router.post("/register", register);
router.post("/login", login);

// Get logged-in user profile
router.get("/profile", auth, getProfile);

// Update logged-in user profile
router.put("/profile", auth, updateProfile);

// CRUD routes
router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser); 

module.exports = router;