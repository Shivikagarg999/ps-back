const express = require("express");
const router = express.Router();
const analyticsController = require("../../controllers/adminController/analyticsController");
const authController = require("../../controllers/adminController/authController");
const userController = require("../../controllers/adminController/userController");
const bookingController = require("../../controllers/bookingController/booking");
const protect = require("../../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Admin Panel
 *   description: Authentication, Analytics, and management APIs for administrators
 */

// --- Public Admin Routes ---

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin Panel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@prettysaheli.com
 *               password:
 *                 type: string
 *                 example: securepassword
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", authController.adminLogin);

/**
 * @swagger
 * /api/admin/signup:
 *   post:
 *     summary: Create a new admin account (Secure)
 *     tags: [Admin Panel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, password, adminSecretKey]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin Name
 *               email:
 *                 type: string
 *                 example: admin@prettysaheli.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: securepassword
 *               adminSecretKey:
 *                 type: string
 *                 example: PrettySaheliAdmin2026
 *     responses:
 *       201:
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Unauthorized - Invalid secret key
 */
router.post("/signup", authController.adminSignup);


// --- Protected Admin Routes ---

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ success: false, message: "Access denied. Admin only." });
    }
};

router.use(protect);
router.use(adminOnly);

/**
 * @swagger
 * /api/admin/analytics/overview:
 *   get:
 *     summary: Get administrative overview stats
 *     tags: [Admin Panel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats and recent activity
 */
router.get("/analytics/overview", analyticsController.getOverview);

/**
 * @swagger
 * /api/admin/analytics/bookings:
 *   get:
 *     summary: Get booking status breakdown
 *     tags: [Admin Panel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats by booking status
 */
router.get("/analytics/bookings", analyticsController.getBookingStats);

/**
 * @swagger
 * /api/admin/analytics/revenue:
 *   get:
 *     summary: Get revenue trends for the last 7 days
 *     tags: [Admin Panel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily revenue stats
 */
router.get("/analytics/revenue", analyticsController.getRevenueStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (customers)
 *     tags: [Admin Panel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get("/users", userController.getAllUsers);

/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Admin Panel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 */
router.get("/bookings", bookingController.getAllBookings);

module.exports = router;
