const Beautician = require("../../models/beautician/beautician");
const Booking = require("../../models/booking/booking");
const bcrypt = require("bcrypt");

// 📌 Register new beautician
const registerBeautician = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      services,
      id,
      availability,
      address,
      password,
      aadhaarNumber,
      aadhaarImage,
    } = req.body;

    // Check if beautician already exists
    const existingBeautician = await Beautician.findOne({ phone });
    if (existingBeautician) {
      return res.status(400).json({ message: "Beautician already exists with this phone number" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const beautician = new Beautician({
      name,
      phone,
      email,
      services,
      id,
      availability,
      address,
      password: hashedPassword,
      aadhaarNumber,
      aadhaarImage,
    });

    await beautician.save();
    res.status(201).json({ message: "Beautician registered successfully", beautician });
  } catch (error) {
    console.error("Error registering beautician:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Get all beauticians
const getAllBeauticians = async (req, res) => {
  try {
    const beauticians = await Beautician.find()
      .populate("services", "name price duration")
      .populate("bookings", "amount status scheduledAt user");

    res.status(200).json({ success: true, data: beauticians });
  } catch (error) {
    console.error("Error fetching beauticians:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Get single beautician
const getBeauticianById = async (req, res) => {
  try {
    const { beauticianId } = req.params;
    const beautician = await Beautician.findById(beauticianId)
      .populate("services", "name price duration")
      .populate({
        path: "bookings",
        populate: { path: "user", select: "name phone email" },
      });

    if (!beautician) {
      return res.status(404).json({ message: "Beautician not found" });
    }

    res.status(200).json({ success: true, beautician });
  } catch (error) {
    console.error("Error fetching beautician:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Update beautician details
const updateBeautician = async (req, res) => {
  try {
    const { beauticianId } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const beautician = await Beautician.findByIdAndUpdate(
      beauticianId,
      updates,
      { new: true }
    );

    if (!beautician) {
      return res.status(404).json({ message: "Beautician not found" });
    }

    res.status(200).json({ message: "Beautician updated successfully", beautician });
  } catch (error) {
    console.error("Error updating beautician:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Delete beautician
const deleteBeautician = async (req, res) => {
  try {
    const { beauticianId } = req.params;
    const beautician = await Beautician.findByIdAndDelete(beauticianId);

    if (!beautician) {
      return res.status(404).json({ message: "Beautician not found" });
    }

    res.status(200).json({ message: "Beautician deleted successfully" });
  } catch (error) {
    console.error("Error deleting beautician:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Toggle beautician active status (block/unblock)
const toggleBeauticianStatus = async (req, res) => {
  try {
    const { beauticianId } = req.params;
    const beautician = await Beautician.findById(beauticianId);

    if (!beautician) {
      return res.status(404).json({ message: "Beautician not found" });
    }

    beautician.isActive = !beautician.isActive;
    await beautician.save();

    res.status(200).json({
      message: `Beautician ${beautician.isActive ? "activated" : "deactivated"} successfully`,
      beautician,
    });
  } catch (error) {
    console.error("Error updating beautician status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Assign beautician to booking
const assignBeauticianToBooking = async (req, res) => {
  try {
    const { bookingId, beauticianId } = req.body;

    // Check booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check beautician
    const beautician = await Beautician.findById(beauticianId);
    if (!beautician) {
      return res.status(404).json({ message: "Beautician not found" });
    }

    // Assign beautician
    booking.beautician = beauticianId;
    await booking.save();

    // Push booking into beautician’s bookings array if not already
    if (!beautician.bookings.includes(bookingId)) {
      beautician.bookings.push(bookingId);
      await beautician.save();
    }

    res.status(200).json({
      message: "Beautician assigned successfully",
      booking,
    });
  } catch (error) {
    console.error("Error assigning beautician:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerBeautician,
  getAllBeauticians,
  getBeauticianById,
  updateBeautician,
  deleteBeautician,
  toggleBeauticianStatus,
  assignBeauticianToBooking,
};
