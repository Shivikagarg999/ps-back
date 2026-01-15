const connectDB = require("../config/db");
const Booking = require("../models/Booking");
const OTP = require("../models/Otp");

(async () => {
  try {
    await connectDB();
    console.log("✅ DB connected for cron");

    await OTP.deleteMany({ expiresAt: { $lt: new Date() } });

    await Booking.updateMany(
      { status: "pending", createdAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) } },
      { status: "cancelled" }
    );

    console.log("✅ Cron job completed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Cron error:", err);
    process.exit(1);
  }
})();
