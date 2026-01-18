const Offer = require("../../models/offer/offer");
const imagekit = require("../../utils/imagekit");

/**
 * @desc    Create new offer
 * @route   POST /api/offers
 * @access  Private/Admin
 */
exports.createOffer = async (req, res) => {
    try {
        let imageUrl = null;

        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `offer_${Date.now()}`,
                folder: "/offers",
            });
            imageUrl = uploadResponse.url;
        }

        const { tagline, description, startDate, endDate, isActive, discountPercentage } = req.body;

        const offer = await Offer.create({
            tagline,
            description,
            imageUrl,
            startDate,
            endDate,
            isActive: isActive !== undefined ? isActive : true,
            discountPercentage,
        });

        res.status(201).json({ success: true, data: offer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get all offers
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
 * @desc    Get active offers
 * @route   GET /api/offers/active
 * @access  Public
 */
exports.getActiveOffers = async (req, res) => {
    try {
        const now = new Date();
        const offers = await Offer.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now },
        }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: offers.length, data: offers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get single offer
 * @route   GET /api/offers/:id
 * @access  Public
 */
exports.getOfferById = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }
        res.status(200).json({ success: true, data: offer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update offer
 * @route   PUT /api/offers/:id
 * @access  Private/Admin
 */
exports.updateOffer = async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `offer_${Date.now()}`,
                folder: "/offers",
            });
            updateData.imageUrl = uploadResponse.url;
        }

        const offer = await Offer.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }

        res.status(200).json({ success: true, data: offer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Delete offer
 * @route   DELETE /api/offers/:id
 * @access  Private/Admin
 */
exports.deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }
        res.status(200).json({ success: true, message: "Offer deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
