const { validationResult } = require("express-validator");

const CategoryModel = require("../models/Category");

// class Category {
//   async createCategory(req, res) {
//     const errors = validationResult(req);
//     const { name } = req.body;
//     if (errors.isEmpty()) {
//       const exist = await CategoryModel.findOne({ name });

//       if (!exist) {
//         await CategoryModel.create({ name });
//         return res.status(201).json({ message: "Category has been Created" });
//       } else {
//         return res.status(401).json({
//           errors: [{ msg: `${name} category already exists` }],
//         });
//       }
//     } else {
//       return res.status(401).json({
//         errors: errors.array(),
//       });
//     }
//   }
// }

// module.exports = new Category();

// @route POST /api/create-category
// @access ADMIN
// @description Creates a Category
module.exports.createCategory = async (req, res) => {
  const errors = validationResult(req);
  const { name } = req.body;
  if (errors.isEmpty()) {
    const exist = await CategoryModel.findOne({ name });

    if (!exist) {
      await CategoryModel.create({ name });
      return res.status(201).json({ message: "Category has been Created" });
    } else {
      return res.status(401).json({
        errors: [{ msg: `${name} category already exists` }],
      });
    }
  } else {
    return res.status(401).json({
      errors: errors.array(),
    });
  }
};
