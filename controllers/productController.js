const formidable = require("formidable");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const ProductModel = require("../models/ProductModel");
// const { validationResult } = require("express-validator");

module.exports.createProduct = async (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (!err) {
      // console.log("fields", fields);
      // console.log("files", files);

      const parsedData = JSON.parse(fields.data);
      const errors = [];

      if (parsedData.title.trim().length === 0) {
        errors.push({ msg: "Title is required" });
      }

      if (parseInt(parsedData.price) < 1) {
        errors.push({ msg: "Price should be greater than 0" });
      }

      if (parseInt(parsedData.discount) < 0) {
        errors.push({ msg: "Discount should not be negative" });
      }

      if (parseInt(parsedData.stock) < 20) {
        errors.push({ msg: "Stock cannot be less than 20" });
      }

      if (parsedData.category.trim().length === 0) {
        errors.push({ msg: "Category is required" });
      }

      if (fields.description.trim().length === 0) {
        errors.push({ msg: "Description is required" });
      }

      if (errors.length === 0) {
        if (!files["image1"]) {
          errors.push({ msg: "image1 is required" });
        }
        if (!files["image2"]) {
          errors.push({ msg: "image2 is required" });
        }

        if (!files["image3"]) {
          errors.push({ msg: "image3 is required" });
        }

        if (errors.length === 0) {
          const images = {};
          for (let i = 0; i < Object.keys(files).length; i++) {
            const mimeType = files[`image${i + 1}`].mimetype;
            const extension = mimeType.split("/")[1].toLowerCase();

            if (
              extension === "jpeg" ||
              extension === "jpg" ||
              extension === "png"
            ) {
              const imageName = uuidv4() + `.${extension}`;

              const __dirname = path.resolve();
              const newPath =
                __dirname +
                `/../mern_eshop_frontend/public/images/${imageName}`;

              images[`image${i + 1}`] = imageName;

              fs.copyFile(files[`image${i + 1}`].filepath, newPath, (err) => {
                if (err) {
                  console.log(err);
                }
              });
            } else {
              const error = {};
              error["msg"] = `image${i + 1} has invalid ${extension} type`;
              errors.push(error);
            }
            console.log(extension);
          }

          if (errors.length === 0) {
            // console.log("all images", images);

            try {
              const response = await ProductModel.create({
                title: parsedData.title,
                price: parseInt(parsedData.price),
                discount: parseInt(parsedData.discount),
                stock: parseInt(parsedData.stock),
                category: parsedData.category,
                colors: parsedData.colors,
                sizes: JSON.parse(fields.sizes),
                image1: images["image1"],
                image2: images["image2"],
                image3: images["image3"],
                description: fields.description,
              });

              return res
                .status(201)
                .json({ msg: "Product Created Successfully", response });
            } catch (error) {
              console.log(error);
              return res.status(500).json({ error });
            }
          } else {
            return res.status(400).json({ errors });
          }
        } else {
          return res.status(400).json({ errors });
        }
      } else {
        return res.status(400).json({ errors });
      }

      //console.log("erroers", errors);

      // req.body.title = parsedData.title;
      // req.body.price = parsedData.price;
      // req.body.discount = parsedData.discount;
      // req.body.stock = parsedData.stock;
      // req.body.category = parsedData.category;
      // req.body.description = fields.description;
      // console.log(parsedData);
    }
  });
};
module.exports.get = async (req, res) => {
  const { page } = req.params;
  const perPage = 5;
  const skip = (page - 1) * perPage;

  try {
    const count = await ProductModel.find({}).countDocuments();
    const response = await ProductModel.find({})
      .skip(skip)
      .limit(perPage)
      .sort({ updatedAt: -1 });

    console.log(response);

    return res.status(200).json({ products: response, perPage, count });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports.getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findOne({ _id: id }).select([
      "-image1",
      "-image2",
      "-image3",
    ]);

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
    console.log(error.message);
  }
};

// UPDATE PRODUCT
module.exports.updateProduct = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    try {
      const {
        _id,
        title,
        price,
        discount,
        stock,
        colors,
        sizes,
        description,
        category,
      } = req.body;

      const resposnse = await ProductModel.updateOne(
        { _id },
        {
          $set: {
            title,
            price,
            discount,
            stock,
            category,
            colors,
            sizes,
            description,
          },
        }
      );

      return res.status(200).json({ msg: "Product Updated", resposnse });
    } catch (error) {
      return res.status(500).json({ errors: error });
    }
  } else {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
};

module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findOne({ _id: id });

    [1, 2, 3].forEach((number) => {
      let key = `image${number}`;
      let image = product[key];

      let __dirname = path.resolve();
      let imagePath =
        __dirname + `/../mern_eshop_frontend/public/images/${image}`;

      fs.unlink(imagePath, (err) => {
        if (err) {
          throw new Error(err);
        }
      });
    });

    await ProductModel.findByIdAndDelete(id);

    return res.status(200).json({ msg: "Product has been Deleted" });
  } catch (error) {
    throw new Error(error.message);
  }
};
