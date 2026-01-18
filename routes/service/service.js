const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const serviceController = require('../../controllers/serviceController/serviceController');

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management APIs
 */

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service (Admin)
 *     tags: [Services]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, price, duration, category]
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               gstAmount:
 *                 type: number
 *               duration:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Service created
 */
router.post('/', upload.single('image'), serviceController.createService);

/**
 * @swagger
 * /api/services/get:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of all services
 */
router.get('/get', serviceController.getAllServices);

/**
 * @swagger
 * /api/services/search:
 *   get:
 *     summary: Search for services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', serviceController.searchServices);

/**
 * @swagger
 * /api/services/category/{categoryId}:
 *   get:
 *     summary: Get services by category ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of services in category
 */
router.get('/category/:categoryId', serviceController.getServicesByCategory);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details
 *   put:
 *     summary: Update service (Admin)
 *     tags: [Services]
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
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               gstAmount:
 *                 type: number
 *               duration:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Service updated
 *   delete:
 *     summary: Delete service (Admin)
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted
 */
router.get('/:id', serviceController.getServiceById);
router.put('/:id', upload.single('image'), serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;