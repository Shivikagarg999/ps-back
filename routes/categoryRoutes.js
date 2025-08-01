const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require("../controllers/categoriesController/categoryController");

const router = express.Router();

router.route("/")
  .post(createCategory)     // Create
  .get(getCategories);      // Read all

router.route("/:id")
  .get(getCategoryById)     // Read one
  .put(updateCategory)      // Update
  .delete(deleteCategory);  // Delete

module.exports = router;