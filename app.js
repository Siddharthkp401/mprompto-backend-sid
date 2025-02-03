const https = require('https');
const fs = require('fs');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const userRoutes = require("./routes/v1/userRoutes");
const demoRoutes = require("./routes/v1/demoRoutes");
const adminRoutes = require("./routes/v1/adminRoutes")
require("dotenv").config();

const privateKey = fs.readFileSync('/var/www/ssl/playground.mprompto.com/playground.mprompto.com.key');
const certificate = fs.readFileSync('/var/www/ssl/playground.mprompto.com/ssl-bundle.crt');

const credentials = {
  key: privateKey,
  cert: certificate,
};

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

connectDB();

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/demo", demoRoutes);
app.use("/api/v1/admin", adminRoutes)

//app.listen(PORT, () => {
//  console.log(`Server is running on port ${PORT}`);
//});
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT);
