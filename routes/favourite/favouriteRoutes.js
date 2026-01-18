const express = require("express");
const router = express.Router();
const protect = require("../../middlewares/auth");
const {
  addToFavourites,
  removeFromFavourites,
  getFavourites,
} = require("../../controllers/favouriteController/favouriteController");

/**
 * @swagger
 * tags:
 *   name: Favourites
 *   description: User favorite services management
 */

/**
 * @swagger
 * /api/user/favourites/get:
 *   get:
 *     summary: Get all favorite services for the logged-in user
 *     tags: [Favourites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite services
 */
router.get("/get", protect, getFavourites);

/**
 * @swagger
 * /api/user/favourites/add:
 *   post:
 *     summary: Add a service to favorites
 *     tags: [Favourites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceId]
 *             properties:
 *               serviceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service added to favorites
 *       400:
 *         description: Already in favorites or bad request
 */
router.post("/add", protect, addToFavourites);

/**
 * @swagger
 * /api/user/favourites/remove:
 *   post:
 *     summary: Remove a service from favorites
 *     tags: [Favourites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceId]
 *             properties:
 *               serviceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Removed from favorites
 */
router.post("/remove", protect, removeFromFavourites);

module.exports = router;