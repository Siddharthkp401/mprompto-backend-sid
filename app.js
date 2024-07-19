const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/v1/userRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000; // eslint-disable-line no-undef
app.use(cors());

connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
