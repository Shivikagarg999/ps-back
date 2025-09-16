require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const categoryRoutes = require("./routes/category/category");
const serviceRoutes = require("./routes/service/service");
const beauticianRoutes= require("./routes/beautician/register");
const userAuthRoutes= require('./routes/user/authRoutes');
const bookingRoutes= require("./routes/booking/booking");
const cartRoutes= require('./routes/cart/cart');
const favouriteRoutes=require('./routes/favourite/favouriteRoutes');
const referralRoutes=require('./routes/user/referralRoutes');

connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/beautician", beauticianRoutes);
app.use("/api/user", userAuthRoutes);
app.use('/api/user/booking', bookingRoutes);
app.use('/api/user/cart', cartRoutes);
app.use('/api/user/favourites', favouriteRoutes);
app.use('/api/user/referral', referralRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));