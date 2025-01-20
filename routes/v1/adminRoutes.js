const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/adminlogin.controller");


// Public routes
router.post("/login", adminController.loginAdmin);


module.exports = router;
