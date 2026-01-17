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

/**
 * @swagger
 * tags:
 *   name: Beauticians
 *   description: Beautician management APIs
 */

/**
 * @swagger
 * /api/beautician/register:
 *   post:
 *     summary: Register a new beautician
 *     tags: [Beauticians]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, email, expertise]
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               expertise:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Beautician registered successfully
 */
router.post("/register", registerBeautician);

/**
 * @swagger
 * /api/beautician:
 *   get:
 *     summary: Get all beauticians
 *     tags: [Beauticians]
 *     responses:
 *       200:
 *         description: List of all beauticians
 */
router.get("/", getAllBeauticians);

/**
 * @swagger
 * /api/beautician/{beauticianId}:
 *   get:
 *     summary: Get beautician by ID
 *     tags: [Beauticians]
 *     parameters:
 *       - in: path
 *         name: beauticianId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Beautician details
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update beautician details
 *     tags: [Beauticians]
 *     parameters:
 *       - in: path
 *         name: beauticianId
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
 *         description: Updated successfully
 *   delete:
 *     summary: Delete a beautician
 *     tags: [Beauticians]
 *     parameters:
 *       - in: path
 *         name: beauticianId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.get("/:beauticianId", getBeauticianById);
router.put("/:beauticianId", updateBeautician);
router.delete("/:beauticianId", deleteBeautician);

/**
 * @swagger
 * /api/beautician/{beauticianId}/toggle-status:
 *   patch:
 *     summary: Toggle beautician active status
 *     tags: [Beauticians]
 *     parameters:
 *       - in: path
 *         name: beauticianId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status toggled
 */
router.patch("/:beauticianId/toggle-status", toggleBeauticianStatus);

/**
 * @swagger
 * /api/beautician/assign-booking:
 *   post:
 *     summary: Assign beautician to a booking
 *     tags: [Beauticians]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [beauticianId, bookingId]
 *             properties:
 *               beauticianId:
 *                 type: string
 *               bookingId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Assigned successfully
 */
router.post("/assign-booking", assignBeauticianToBooking);

module.exports = router;
