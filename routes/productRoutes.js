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

router.post("/create-product", Authorization.authorized, createProduct);
router.get("/products/:page", Authorization.authorized, get);
router.get("/product/:id", Authorization.authorized, getProduct);
router.put(
  "/product",
  [Authorization.authorized, productValidations],
  updateProduct
);

router.delete("/delete/:id", Authorization.authorized, deleteProduct);

module.exports = router;
