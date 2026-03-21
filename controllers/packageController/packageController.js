const Package = require('../../models/package/package');
const imagekit = require("../../utils/imagekit");

// @desc    Create a new package
// @route   POST /api/packages
// @access  Admin
exports.createPackage = async (req, res) => {
  try {
    const { name, description, services, price, gstAmount, discountPercentage } = req.body;

    let imageUrl = '';
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `package_${Date.now()}`,
        folder: "/packages",
      });
      imageUrl = uploadResponse.url;
    }

    const newPackage = new Package({
      name,
      description,
      services: typeof services === 'string' ? JSON.parse(services) : services,
      price: Number(price),
      gstAmount: Number(gstAmount) || 0,
      discountPercentage: Number(discountPercentage) || 0,
      imageUrl,
      isActive: req.body.isActive === 'true' || req.body.isActive === true
    });

    await newPackage.save();
    res.status(201).json({ success: true, data: newPackage });
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().populate('services');
    res.status(200).json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
exports.getPackageById = async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id).populate('services');
    if (!packageData) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.status(200).json({ success: true, data: packageData });
  } catch (error) {
    console.error("Error fetching package:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Admin
exports.updatePackage = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `package_${Date.now()}`,
        folder: "/packages",
      });
      updateData.imageUrl = uploadResponse.url;
    }

    if (updateData.services) {
      updateData.services = typeof updateData.services === 'string' 
        ? JSON.parse(updateData.services) 
        : updateData.services;
    }
    
    if (updateData.isActive !== undefined) {
        updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
    }

    const packageData = await Package.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    if (!packageData) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.status(200).json({ success: true, data: packageData });
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Admin
exports.deletePackage = async (req, res) => {
  try {
    const packageData = await Package.findByIdAndDelete(req.params.id);
    if (!packageData) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.status(200).json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
