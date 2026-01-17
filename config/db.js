const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error (SRV):", error.message);
    if (process.env.MONGO_URI_STANDARD) {
      try {
        console.log("Attempting fallback to standard connection string...");
        await mongoose.connect(process.env.MONGO_URI_STANDARD);
        console.log("MongoDB connected successfully (Fallback)");
        return;
      } catch (fallbackError) {
        console.error("MongoDB fallback connection error:", fallbackError.message);
      }
    }

    process.exit(1);
  }
};

module.exports = connectDB;