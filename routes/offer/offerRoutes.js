const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const offerController = require("../../controllers/offerController/offerController");

/**
 * @swagger
 * tags:
 *   name: Offers
 *   description: Promotional banners management
 */

/**
 * @swagger
 * /api/offers:
 *   post:
 *     summary: Create a new banner (Admin)
 *     tags: [Offers]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               isActive:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Banner created
 *   get:
 *     summary: Get all banners
 *     tags: [Offers]
 *     responses:
 *       200:
 *         description: List of all banners
 */
router.post("/", upload.single("image"), offerController.createOffer);
router.get("/", offerController.getAllOffers);

/**
 * @swagger
 * /api/offers/active:
 *   get:
 *     summary: Get all active banners
 *     tags: [Offers]
 *     responses:
 *       200:
 *         description: List of active banners
 */
router.get("/active", offerController.getActiveOffers);

/**
 * @swagger
 * /api/offers/{id}:
 *   put:
 *     summary: Update banner (Admin)
 *     tags: [Offers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Banner updated
 *   delete:
 *     summary: Delete banner (Admin)
 *     tags: [Offers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner deleted
 */
router.put("/:id", upload.single("image"), offerController.updateOffer);
router.delete("/:id", offerController.deleteOffer);

module.exports = router;
