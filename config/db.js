const mongoose = require("mongoose");
const env = require("./envConfig");

const connect = async () => {
  try {
    await mongoose.connect(env.MONGO_URL);
    console.log("Database Connected");
  } catch (error) {
    console.log(error.message);
    process.exit;
  }
};

module.exports = connect;
