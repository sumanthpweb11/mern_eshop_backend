const brcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/envConfig");

// Hashed Password
module.exports.hashedPassword = async (password) => {
  const salt = await brcrypt.genSalt(10);
  const hashed = await brcrypt.hash(password, salt);

  return hashed;
};

// Check if Password is matcing during Login
module.exports.comparePassword = async (password, dbPassword) => {
  return await brcrypt.compare(password, dbPassword);
};

// JWT
module.exports.createToken = (user) => {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: "7d",
  });
};
