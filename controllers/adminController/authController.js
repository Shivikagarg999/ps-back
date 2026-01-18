const User = require("../../models/user/user");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user || user.role !== "admin") {
            return res.status(401).json({ success: false, message: "Invalid credentials or not an admin" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "365d" }
        );

        res.json({
            success: true,
            message: "Admin login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Admin Signup (Secure with secret key)
exports.adminSignup = async (req, res) => {
    try {
        const { name, email, phone, password, adminSecretKey } = req.body;

        if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid admin secret key" });
        }

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email or phone already registered" });
        }

        const admin = new User({
            name,
            email,
            phone,
            password,
            role: 'admin'
        });

        await admin.save();

        res.status(201).json({
            success: true,
            message: "Admin account created successfully",
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
