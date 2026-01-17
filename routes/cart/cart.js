const express = require("express");
const router = express.Router();
const protect = require("../../middlewares/auth");
const { addToCart, removeFromCart, updateQuantity, getCart } = require("../../controllers/cartcontroller/cartController");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management APIs
 */

/**
 * @swagger
 * /api/user/cart/getcart:
 *   get:
 *     summary: Get user shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart data
 */
router.get("/getcart", protect, getCart);

/**
 * @swagger
 * /api/user/cart/add:
 *   post:
 *     summary: Add service to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceId, quantity]
 *             properties:
 *               serviceId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Added to cart
 */
router.post("/add", protect, addToCart);

/**
 * @swagger
 * /api/user/cart/remove/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed from cart
 */
router.delete("/remove/:itemId", protect, removeFromCart);

/**
 * @swagger
 * /api/user/cart/update/{itemId}:
 *   put:
 *     summary: Update item quantity in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantity updated
 */
router.put("/update/:itemId", protect, updateQuantity);

module.exports = router;