const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const packageController = require('../../controllers/packageController/packageController');
// const { protect, admin } = require('../../middlewares/auth'); // Assuming there's an auth middleware

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Package management APIs
 */

/**
 * @swagger
 * /api/packages:
 *   post:
 *     summary: Create a new package (Admin)
 *     tags: [Packages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, services, price]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Service ID
 *               price:
 *                 type: number
 *               gstAmount:
 *                 type: number
 *               discountPercentage:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Package created
 *   get:
 *     summary: Get all packages
 *     tags: [Packages]
 *     responses:
 *       200:
 *         description: List of all packages
 */
router.post('/', upload.single('image'), packageController.createPackage);
router.get('/', packageController.getAllPackages);

/**
 * @swagger
 * /api/packages/{id}:
 *   get:
 *     summary: Get package by ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Package details
 *   put:
 *     summary: Update package (Admin)
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Package updated
 *   delete:
 *     summary: Delete package (Admin)
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Package deleted
 */
router.get('/:id', packageController.getPackageById);
router.put('/:id', upload.single('image'), packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);

module.exports = router;
