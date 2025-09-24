const express = require("express");
const router = express.Router();
const {
  registerBeautician,
  getAllBeauticians,
  getBeauticianById,
  updateBeautician,
  deleteBeautician,
  toggleBeauticianStatus,
  assignBeauticianToBooking,
} = require("../../controllers/beauticianController/beauticianController");

// ➕ Register beautician
router.post("/register", registerBeautician);

// 📌 Get all beauticians
router.get("/", getAllBeauticians);

// 📌 Get single beautician by ID
router.get("/:beauticianId", getBeauticianById);

// ✏️ Update beautician
router.put("/:beauticianId", updateBeautician);

// ❌ Delete beautician
router.delete("/:beauticianId", deleteBeautician);

// 🔄 Toggle active status (block/unblock)
router.patch("/:beauticianId/toggle-status", toggleBeauticianStatus);

// 📌 Assign beautician to booking
router.post("/assign-booking", assignBeauticianToBooking);

module.exports = router;
