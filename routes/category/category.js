const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require("../../controllers/categoriesController/categoryController");

// Multer setup for handling image upload in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategory); 
router.put("/:id", upload.single("image"), updateCategory); 
router.delete("/:id", deleteCategory);

module.exports = router;
