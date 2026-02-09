const Beautician = require("../../models/beautician/beautician");
const Booking = require("../../models/booking/booking");
const Notification = require("../../models/notification/notification");
const bcrypt = require("bcrypt");
const imagekit = require("../../utils/imagekit");

// Helper function to upload file to ImageKit
const uploadToImageKit = async (fileBuffer, fileName, folder = "beauticians") => {
  try {
    const result = await imagekit.upload({
      file: fileBuffer, // buffer
      fileName: fileName,
      folder: folder
    });
    return result.url;
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw new Error("Image upload failed");
  }
};

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
      // New fields
      age,
      joiningDate,
      alternatePhone,
      bookingReferral,
      skills,
      salary,
      panNumber,
    } = req.body;

    // Check if beautician already exists
    const existingBeautician = await Beautician.findOne({ phone });
    if (existingBeautician) {
      return res.status(400).json({ message: "Beautician already exists with this phone number" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle File Uploads
    const files = req.files || {};
    let aadhaarUrl = "", panCardUrl = "", joiningLetterUrl = "", signedJoiningLetterUrl = "", signedOfferLetterUrl = "", profilePicUrl = "";

    if (files.aadhaarImage) aadhaarUrl = await uploadToImageKit(files.aadhaarImage[0].buffer, files.aadhaarImage[0].originalname);
    if (files.panImage) panCardUrl = await uploadToImageKit(files.panImage[0].buffer, files.panImage[0].originalname);
    if (files.joiningLetter) joiningLetterUrl = await uploadToImageKit(files.joiningLetter[0].buffer, files.joiningLetter[0].originalname);
    if (files.signedJoiningLetter) signedJoiningLetterUrl = await uploadToImageKit(files.signedJoiningLetter[0].buffer, files.signedJoiningLetter[0].originalname);
    if (files.signedOfferLetter) signedOfferLetterUrl = await uploadToImageKit(files.signedOfferLetter[0].buffer, files.signedOfferLetter[0].originalname);
    if (files.profilePic) profilePicUrl = await uploadToImageKit(files.profilePic[0].buffer, files.profilePic[0].originalname);

    const beautician = new Beautician({
      name,
      phone,
      email,
      services, // Assuming array of IDs handling naturally
      id,
      availability, // Assuming JSON structure handling naturally
      address, // Assuming object structure handling naturally
      password: hashedPassword,
      aadhaarNumber,
      aadhaarImage: aadhaarUrl, // Using existing field for aadhaar image URL if it was there, or create new if not defined in schema (it is defined)

      // New Fields
      age,
      joiningDate,
      alternatePhone,
      bookingReferral,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',') : []), // Handle string or array
      salary,

      panNumber,
      panCardImage: panCardUrl,

      joiningLetter: joiningLetterUrl,
      signedJoiningLetter: signedJoiningLetterUrl,

      signedOfferLetter: signedOfferLetterUrl,
      profilePic: profilePicUrl,
    });

    await beautician.save();
    res.status(201).json({ message: "Beautician registered successfully", beautician });
  } catch (error) {
    console.error("Error registering beautician:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    if (updates.skills && typeof updates.skills === 'string') {
      updates.skills = updates.skills.split(',');
    }

    // Remove complex nested object handling from req.body if it exists, as we handle files separately
    if (updates.documents) delete updates.documents;

    // Handle File Uploads
    const files = req.files || {};

    if (files.aadhaarImage) {
      updates.aadhaarImage = await uploadToImageKit(files.aadhaarImage[0].buffer, files.aadhaarImage[0].originalname);
    }
    if (files.panImage) {
      updates.panCardImage = await uploadToImageKit(files.panImage[0].buffer, files.panImage[0].originalname);
    }
    if (files.joiningLetter) {
      updates.joiningLetter = await uploadToImageKit(files.joiningLetter[0].buffer, files.joiningLetter[0].originalname);
    }
    if (files.signedJoiningLetter) {
      updates.signedJoiningLetter = await uploadToImageKit(files.signedJoiningLetter[0].buffer, files.signedJoiningLetter[0].originalname);
    }
    if (files.signedOfferLetter) {
      updates.signedOfferLetter = await uploadToImageKit(files.signedOfferLetter[0].buffer, files.signedOfferLetter[0].originalname);
    }
    if (files.profilePic) {
      updates.profilePic = await uploadToImageKit(files.profilePic[0].buffer, files.profilePic[0].originalname);
    }

    const beautician = await Beautician.findByIdAndUpdate(
      beauticianId,
      { $set: updates },
      { new: true }
    );

    if (!beautician) {
      return res.status(404).json({ message: "Beautician not found" });
    }

    res.status(200).json({ message: "Beautician updated successfully", beautician });
  } catch (error) {
    console.error("Error updating beautician:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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

    // Trigger Notification for User
    await Notification.create({
      user: booking.user,
      title: "Beautician Assigned! 💄",
      message: `${beautician.name} has been assigned for your appointment.`,
      type: "booking",
      metadata: {
        bookingId: booking._id,
        serviceId: booking.services[0]?.service // Assuming first service relation
      }
    });

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
