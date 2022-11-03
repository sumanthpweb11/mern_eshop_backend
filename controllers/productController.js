const formidable = require("formidable");

module.exports.createProduct = async (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (!err) {
      console.log("fields", fields);
      console.log("files", files);
    }
  });
};
