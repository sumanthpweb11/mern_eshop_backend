const express = require("express");
const router = express.Router();
const categoryValidations = require("../validations/categoryValidations");
const Authorization = require("../services/Authorization");

// ---------------Import Controllers-------------------

const {
  createCategory,
  categories,
  fetchCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// ---------------Routes--------------------------

// GET ALL CATEGORY ROUTE and PAGINATION

router.get("/categories/:page", Authorization.authorized, categories);

// CREATE CATEGORY ROUTE
router.post(
  "/create-category",
  [categoryValidations, Authorization.authorized],
  createCategory
);

// FETCH SINGLE CATEGORY ROUTE
router.get("/fetch-category/:id", Authorization.authorized, fetchCategory);

// UPDATE CATEGORY
router.put(
  "/update-category/:id",
  [categoryValidations, Authorization.authorized],
  updateCategory
);

// DELETE CATEGORY
router.delete("/delete-category/:id", Authorization.authorized, deleteCategory);

module.exports = router;
