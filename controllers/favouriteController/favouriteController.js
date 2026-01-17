const User = require("../../models/user/user");
const Service = require("../../models/service/service");

// Add to Favourites
exports.addToFavourites = async (req, res) => {
  try {
    const { serviceId } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const user = await User.findById(req.user._id);

    if (user.favorites.includes(serviceId)) {
      return res.status(400).json({ success: false, message: "Already in favourites" });
    }

    user.favorites.push(serviceId);
    await user.save();

    res.json({ success: true, message: "Added to favourites", data: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove from Favourites
exports.removeFromFavourites = async (req, res) => {
  try {
    const { serviceId } = req.body;

    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== serviceId
    );
    await user.save();

    res.json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get All Favourites
exports.getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites", "name price duration imageUrl");

    res.json({ success: true, data: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
