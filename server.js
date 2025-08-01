const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
// const serviceRoutes = require("./routes/serviceRoutes");
// const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/api/categories", categoryRoutes);
// app.use("/api/services", serviceRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));