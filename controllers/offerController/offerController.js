const Offer = require("../../models/offer/offer");
const imagekit = require("../../utils/imagekit");

/**
 * @desc    Create new banner/offer
 * @route   POST /api/offers
 * @access  Private/Admin
 */
exports.createOffer = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Banner image is required" });
        }

        const uploadResponse = await imagekit.upload({
            file: req.file.buffer,
            fileName: `banner_${Date.now()}`,
            folder: "/offers",
        });

        const offer = await Offer.create({
            imageUrl: uploadResponse.url,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        });

        res.status(201).json({ success: true, data: offer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get all offers/banners
 * @route   GET /api/offers
 * @access  Public
 */
exports.getAllOffers = async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: offers.length, data: offers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get active banners
 * @route   GET /api/offers/active
 * @access  Public
 */
exports.getActiveOffers = async (req, res) => {
    try {
        const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: offers.length, data: offers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update banner status or image
 * @route   PUT /api/offers/:id
 * @access  Private/Admin
 */
exports.updateOffer = async (req, res) => {
    try {
        let updateData = {};

        if (req.body.isActive !== undefined) {
            updateData.isActive = req.body.isActive;
        }

        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `banner_${Date.now()}`,
                folder: "/offers",
            });
            updateData.imageUrl = uploadResponse.url;
        }

        const offer = await Offer.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!offer) {
            return res.status(404).json({ success: false, message: "Banner not found" });
        }

        res.status(200).json({ success: true, data: offer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Delete banner
 * @route   DELETE /api/offers/:id
 * @access  Private/Admin
 */
exports.deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) {
            return res.status(404).json({ success: false, message: "Banner not found" });
        }
        res.status(200).json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
