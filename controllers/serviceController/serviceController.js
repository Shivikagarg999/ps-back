const Service = require('../../models/service/service');
const Category = require("../../models/category/category");
const imagekit = require('../../utils/imagekit');

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

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate('category', 'name');
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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

exports.searchServices = async (req, res) => {
  try {
    const { 
      query, 
      category, 
      minPrice, 
      maxPrice, 
      isPopular, 
      isActive,
      page = 1, 
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const searchFilter = {};

    if (query) {
      searchFilter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    if (category) {
      searchFilter.category = category;
    }

    if (minPrice || maxPrice) {
      searchFilter.price = {};
      if (minPrice) searchFilter.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchFilter.price.$lte = parseFloat(maxPrice);
    }

    if (isPopular !== undefined) {
      searchFilter.isPopular = isPopular === 'true';
    }

    if (isActive !== undefined) {
      searchFilter.isActive = isActive === 'true';
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const services = await Service.find(searchFilter)
      .populate('category', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalServices: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getServicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { 
      page = 1, 
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      isActive = 'true',
      isPopular
    } = req.query;

    const filter = { category: categoryId };

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (isPopular !== undefined) {
      filter.isPopular = isPopular === 'true';
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const services = await Service.find(filter)
      .populate('category', 'name description imageUrl')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    const category = await Category.findById(categoryId);

    res.status(200).json({
      success: true,
      data: services,
      category: category || null,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalServices: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};