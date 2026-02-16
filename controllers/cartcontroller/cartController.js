const Cart = require("../../models/cart/cart");
const Service = require("../../models/service/service");

// ➕ Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { serviceId, addons = [], quantity = 1 } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // calculate total price for this item
    const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
    const totalPrice = (service.price + addonsTotal) * quantity;

    // find existing cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // check if item already exists
    const existingItem = cart.items.find(
      (item) =>
        item.service.toString() === serviceId &&
        JSON.stringify(item.addons) === JSON.stringify(addons)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice += totalPrice;
    } else {
      cart.items.push({ service: serviceId, addons, quantity, totalPrice });
    }

    // recalc grand total
    cart.grandTotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

    await cart.save();
    await cart.populate("items.service");
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🗑 Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    cart.grandTotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

    await cart.save();
    await cart.populate("items.service");
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update Quantity
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ user: userId }).populate("items.service");
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.find((item) => item._id.toString() === itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    if (quantity < 1) return res.status(400).json({ success: false, message: "Quantity must be at least 1" });

    const addonsTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0);
    item.quantity = quantity;
    item.totalPrice = (item.service.price + addonsTotal) * quantity;

    cart.grandTotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

    await cart.save();
    await cart.populate("items.service");
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📦 Get User Cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID" });
    }

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.service",
      model: "Service"
    });

    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [], grandTotal: 0 } });
    }

    res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("❌ Error in getCart:", err); // 👈 log full error
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};
