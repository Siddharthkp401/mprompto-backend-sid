const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/adminlogin.controller");
const adminDashboardController = require("../../controllers/admin/admindashboard.controller");
const { authenticateToken } = require("../../middleware/authenticate");

// Public routes
router.post("/login", adminController.loginAdmin);

// Admin dashboard route
router.get("/admin-dashboard", authenticateToken("admin"), adminDashboardController.getAdminDashboard);

module.exports = router;
