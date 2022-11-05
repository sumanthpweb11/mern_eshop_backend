const { validationResult } = require("express-validator");
const UserModel = require("../models/User");
const {
  hashedPassword,
  createToken,
  comparePassword,
} = require("../services/authservices");

// @route POST /api/register
// @access Public
// @description Create User and return a Token
module.exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    // console.log(errors.array());

    const { name, email, password } = req.body;

    try {
      const emailExist = await UserModel.findOne({ email });
      if (!emailExist) {
        // Creating user and hashed password (bycrypt)
        // check authservices in 'services' folder
        const hashed = await hashedPassword(password);
        const user = await UserModel.create({
          name,
          email,
          password: hashed,
        });

        // jwt
        // check authservices in 'services' folder
        const token = createToken({ id: user._id, name: user.name });

        return res
          .status(201)
          .json({ msg: "Your account has been created!", token });
      } else {
        // email already taken
        return res.status(400).json({
          errors: [{ msg: `${email} is already taken`, param: "email" }],
        });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json("Server Internal Error");
    }
  } else {
    // if validations failed
    return res.status(400).json({
      errors: errors.array(),
    });
  }
};

// @route POST /api/login
// @access Public
// @description Login User and return a Token

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        // if user exists then we match passeord from db
        // check if password matches
        // check authservices in 'services' folder
        if (await comparePassword(password, user.password)) {
          // create token and
          // if password matches then check user is
          // ADMIN OR NORMAL USER
          const token = createToken({ id: user._id, name: user.name });
          if (user.admin) {
            return res.status(201).json({ token, admin: true });
          } else {
            return res.status(201).json({ token, admin: false });
          }
        } else {
          res.status(400).json({
            errors: [{ msg: "Password does not match", param: "password" }],
          });
        }
      } else {
        return res.status(400).json({
          errors: [{ msg: `${email} is not found`, param: "email" }],
        });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json("Server internal error");
    }
  } else {
    // validation failed
    return res.status(400).json({ errors: errors.array() });
  }
};
