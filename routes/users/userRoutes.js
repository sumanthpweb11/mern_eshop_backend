const express = require("express");
const router = express.Router();
const {
  registerValidations,
  loginValidations,
} = require("../../validations/userValidations");

// ---------------Import Controllers-------------------
//  Import Controllers
const { register, login } = require("../../controllers/users/usersController");

// ---------------Routes--------------------------
// Register Route
router.post("/register", registerValidations, register);

// Login Route
router.post("/login", loginValidations, login);

module.exports = router;
