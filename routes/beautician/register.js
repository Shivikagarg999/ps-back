const express = require("express");
const router = express.Router();
const { registerBeautician } = require("../../controllers/beauticianController/register");

// ➕ Register beautician
router.post("/register", registerBeautician);

module.exports = router;