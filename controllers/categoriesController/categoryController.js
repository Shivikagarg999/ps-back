const Category = require("../../models/category/category");

// Create Category
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// Get All Categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// Get Single Category
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// Update Category
exports.updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// Delete Category
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    next(error);
  }
};
