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
      return res.status(400).json({
        errors: [{ msg: `${name} category already exists` }],
      });
    }
  } else {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
};

// @route GET /api/categories/:page
// @access Admin
// @description GETS ALL CATEGORIES
module.exports.categories = async (req, res) => {
  const page = req.params.page;
  const perPage = 3;
  const skip = (page - 1) * perPage;
  try {
    const count = await CategoryModel.find({}).countDocuments();
    const response = await CategoryModel.find({})
      .skip(skip)
      .limit(perPage)
      .sort({ updatedAt: -1 });

    // console.log(response);

    return res.status(200).json({ categories: response, perPage, count });
  } catch (error) {
    console.log(error.message);
  }
};

// @route GET /api/fetch-category
// @access Admin
// @description fetch Single category
module.exports.fetchCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await CategoryModel.findOne({ _id: id });
    // console.log("controller res", response);
    return res.status(200).json({ category: response });
  } catch (error) {
    console.log(error.message);
  }
};

// @route GET /api/allcategories
// @access Admin
// @description fetch All Categories

module.exports.allCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({});
    return res.status(200).json({ categories });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Internal Server Error");
  }
};

// @route POSt /api/fetch-category
// @access Admin
// @description Update category

module.exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const exist = await CategoryModel.findOne({ name });

    if (!exist) {
      const response = await CategoryModel.updateOne(
        { _id: id },
        { $set: { name } }
      );

      return res.status(201).json({ message: "Category has updated Created" });
    } else {
      return res
        .status(400)
        .json({ errors: [{ msg: `${name}  already exists` }] });
    }
  } else {
    return res.status(400).json({ errors: errors.array() });
  }
};

// @route POSt /api/delete-category
// @access Admin
// @description Delete category

module.exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await CategoryModel.deleteOne({ _id: id });
    return res
      .status(200)
      .json({ message: "Category has been deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Internal Server Error");
  }
};

// @route POSt /api/random-categories
// @access Public
// @description Random Categories

module.exports.randomCategories = async (req, res) => {
  try {
    // From Category model ftech 3 random categories
    const categories = await CategoryModel.aggregate([
      { $sample: { size: 3 } },
    ]);

    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json("Server internal error");
  }
};
