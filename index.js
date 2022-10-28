const express = require("express");
const env = require("./config/envConfig");
const cors = require("cors");
const connect = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// Database Connection
connect();
app.use(cors());

// Middlewares
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "get route!" });
});

// User Routes
app.use("/api", userRoutes);

// Category Routes
app.use("/api", categoryRoutes);

const port = env.PORT || 5000;

app.listen(port, (req, res) => {
  console.log(`Your Server is running on Port ${port}`);
});
