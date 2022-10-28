const express = require("express");
const router = express.Router();
const categoryValidations = require("../validations/categoryValidations");

// ---------------Import Controllers-------------------

const { createCategory } = require("../controllers/categoryController");

// ---------------Routes--------------------------

// CREATE CATEGORY ROUTE
router.post("/create-category", categoryValidations, createCategory);

module.exports = router;
