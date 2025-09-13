const Service = require('../../models/service/service');
const imagekit = require('../../utils/imagekit');

// Create Service
exports.createService = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `service_${Date.now()}`,
        folder: '/services'
      });
      imageUrl = uploadResponse.url;
    }

    const { name, description, price, duration, category, isPopular, isActive, isIncluded } = req.body;

    // Validate isIncluded (must be exactly 5 points)
    if (!isIncluded || !Array.isArray(isIncluded) || isIncluded.length !== 5) {
      return res.status(400).json({
        success: false,
        message: "isIncluded must be an array of exactly 5 points"
      });
    }

    const service = await Service.create({
      name,
      description,
      price,
      duration,
      category,
      imageUrl,
      isPopular: isPopular || false,
      isActive: isActive !== undefined ? isActive : true,
      isIncluded
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Services (Rename from getServices to getAllServices)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate('category', 'name');
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Service (Rename from getService to getServiceById)
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('category', 'name');
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Service
exports.updateService = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `service_${Date.now()}`,
        folder: '/services'
      });
      updateData.imageUrl = uploadResponse.url;
    }

    const service = await Service.findByIdAndUpdate(req.params.id, updateData, { 
      new: true,
      runValidators: true 
    }).populate('category', 'name');

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
