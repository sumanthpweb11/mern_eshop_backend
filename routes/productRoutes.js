const express = require("express");
const router = express.Router();
const Authorization = require("../services/Authorization");
const productValidations = require("../validations/productValidations");

const {
  createProduct,
  get,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController.js");

const { catProducts } = require("../controllers/HomeProductsController");

router.post("/create-product", Authorization.authorized, createProduct);
router.get("/products/:page", Authorization.authorized, get);
router.get("/product/:id", getProduct);
router.put(
  "/product",
  [Authorization.authorized, productValidations],
  updateProduct
);

router.delete("/delete/:id", Authorization.authorized, deleteProduct);

// Get Products according to Category Card Clicked
router.get("/cat-products/:name/:page", catProducts);

module.exports = router;
