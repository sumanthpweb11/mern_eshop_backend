const ProductModel = require("../models/ProductModel");

module.exports.catProducts = async (req, res) => {
  const { name, page } = req.params;
  const perPage = 3;
  const skip = (page - 1) * perPage;

  try {
    const count = await ProductModel.find({ category: name })
      .where("stock")
      .gt(0)
      .countDocuments();
    const response = await ProductModel.find({ category: name })
      .where("stock")
      .gt(0)
      .skip(skip)
      .limit(perPage)
      .sort({ updatedAt: -1 });

    console.log(response);

    return res.status(200).json({ products: response, perPage, count });
  } catch (error) {
    console.log(error.message);
  }
};
