const express = require("express");
const router = express.Router();
const protect = require("../../middlewares/auth");
const { addToCart, removeFromCart, updateQuantity, getCart } = require("../../controllers/cartcontroller/cartController");

router.post("/add", protect, addToCart);
router.delete("/remove/:itemId", protect, removeFromCart);
router.put("/update/:itemId", protect, updateQuantity);
router.get("/", protect, getCart);

module.exports = router;