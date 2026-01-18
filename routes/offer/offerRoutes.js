const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const offerController = require("../../controllers/offerController/offerController");

/**
 * @swagger
 * tags:
 *   name: Offers
 *   description: Promotional offers and banners management
 */

/**
 * @swagger
 * /api/offers:
 *   post:
 *     summary: Create a new offer (Admin)
 *     tags: [Offers]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [tagline, description, startDate, endDate]
 *             properties:
 *               tagline:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               discountPercentage:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Offer created
 *   get:
 *     summary: Get all offers
 *     tags: [Offers]
 *     responses:
 *       200:
 *         description: List of all offers
 */
router.post("/", upload.single("image"), offerController.createOffer);
router.get("/", offerController.getAllOffers);

/**
 * @swagger
 * /api/offers/active:
 *   get:
 *     summary: Get all active offers within current date
 *     tags: [Offers]
 *     responses:
 *       200:
 *         description: List of active offers
 */
router.get("/active", offerController.getActiveOffers);

/**
 * @swagger
 * /api/offers/{id}:
 *   get:
 *     summary: Get offer by ID
 *     tags: [Offers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Offer details
 *   put:
 *     summary: Update offer (Admin)
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
 *               tagline:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               discountPercentage:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Offer updated
 *   delete:
 *     summary: Delete offer (Admin)
 *     tags: [Offers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Offer deleted
 */
router.get("/:id", offerController.getOfferById);
router.put("/:id", upload.single("image"), offerController.updateOffer);
router.delete("/:id", offerController.deleteOffer);

module.exports = router;
