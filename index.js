const express = require("express");
const env = require("./config/envConfig");
const connect = require("./config/db");
const userRoutes = require("./routes/users/userRoutes");

const app = express();

// Database Connection
connect();

// Middlewares
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "get route!" });
});

// User Routes
app.use("/api", userRoutes);

const port = env.PORT || 5000;

app.listen(port, (req, res) => {
  console.log(`Your Server is running on Port ${port}`);
});
