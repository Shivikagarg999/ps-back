const express = require("express");
const router = express.Router();
const protect = require("../../middlewares/auth");
const {
  addToFavourites,
  removeFromFavourites,
  getFavourites,
} = require("../../controllers/favouriteController/favouriteController");

router.post("/add", protect, addToFavourites);
router.delete("/remove/:serviceId", protect, removeFromFavourites);
router.get("/", protect, getFavourites);

module.exports = router;
