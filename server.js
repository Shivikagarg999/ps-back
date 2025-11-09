require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const categoryRoutes = require("./routes/category/category");
const serviceRoutes = require("./routes/service/service");
const beauticianRoutes = require("./routes/beautician/beauticianRoute");
const userAuthRoutes = require("./routes/user/authRoutes");
const bookingRoutes = require("./routes/booking/booking");
const cartRoutes = require("./routes/cart/cart");
const favouriteRoutes = require("./routes/favourite/favouriteRoutes");
const referralRoutes = require("./routes/user/referralRoutes");
const otpRoutes= require("./routes/otp/otpRoutes");

connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/beautician", beauticianRoutes);
app.use("/api/user", userAuthRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/user/booking", bookingRoutes);
app.use("/api/user/cart", cartRoutes);
app.use("/api/user/favourites", favouriteRoutes);
app.use("/api/user/referral", referralRoutes);

app.use((err, req, res, next) => {
  console.error("🔥 Backend Error:", err.stack);
  res.status(500).json({ success: false, message: err.message });
});
app.get('/', (req, res) => {
  res.send('✨Backend is running successfully!✨');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));