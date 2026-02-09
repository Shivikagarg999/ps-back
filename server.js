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
const otpRoutes = require("./routes/otp/otpRoutes");
const notificationRoutes = require("./routes/notification/notificationRoutes");
const paymentRoutes = require("./routes/payment/paymentRoutes");
const offerRoutes = require("./routes/offer/offerRoutes");
const adminRoutes = require("./routes/admin/adminRoutes");
const initPaymentCleanup = require("./utils/paymentCleanup");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

connectDB();
initPaymentCleanup();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "https://prettysaheli.com",
        "https://www.prettysaheli.com"
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/beautician", beauticianRoutes);
app.use("/api/user", userAuthRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/user/booking", bookingRoutes);
app.use("/api/user/cart", cartRoutes);
app.use("/api/user/favourites", favouriteRoutes);
app.use("/api/user/referral", referralRoutes);
app.use("/api/user/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

app.use((err, req, res, next) => {
  console.error("🔥Backend Error:", err.stack);
  res.status(500).json({ success: false, message: err.message });
});
app.get('/', (req, res) => {
  res.send('✨Welcome to Pretty Saheli Backend. Server is running.✨');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));