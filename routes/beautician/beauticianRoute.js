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

const upload = require("../../middlewares/upload");

/**
 * @swagger
 * /api/beautician/register:
 *   post:
 *     summary: Register a new beautician
 *     tags: [Beauticians]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, phone, email]
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               aadhaarImage:
 *                 type: string
 *                 format: binary
 *               panImage:
 *                 type: string
 *                 format: binary
 *               joiningLetter:
 *                 type: string
 *                 format: binary
 *               signedOfferLetter:
 *                 type: string
 *                 format: binary
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Beautician registered successfully
 */
router.post(
  "/register",
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panImage", maxCount: 1 },
    { name: "joiningLetter", maxCount: 1 },
    { name: "signedJoiningLetter", maxCount: 1 },
    { name: "signedOfferLetter", maxCount: 1 },
    { name: "profilePic", maxCount: 1 },
  ]),
  registerBeautician
);

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
 *         multipart/form-data:
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
router.put(
  "/:beauticianId",
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panImage", maxCount: 1 },
    { name: "joiningLetter", maxCount: 1 },
    { name: "signedJoiningLetter", maxCount: 1 },
    { name: "signedOfferLetter", maxCount: 1 },
    { name: "profilePic", maxCount: 1 },
  ]),
  updateBeautician
);
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
