const express = require("express");
const router = express.Router();
const Authorization = require("../services/Authorization");

const { createProduct } = require("../controllers/productController.js");

router.post("/create-product", Authorization.authorized, createProduct);

module.exports = router;
