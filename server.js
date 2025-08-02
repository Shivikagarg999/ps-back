const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const serviceRoutes = require("./routes/service/service");
const beauticianRoutes= require("./routes/beautician/register")
const userAuthRoutes= require('./routes/user/authRoutes')

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/beautician", beauticianRoutes)
app.use("/api/user", userAuthRoutes)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));