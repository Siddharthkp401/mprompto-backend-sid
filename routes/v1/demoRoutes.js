const express = require("express");
const router = express.Router();
const clientController = require("../../controllers/demo/client.controller"); 

// Public routes
router.post("/client/create-or-update", clientController.createOrUpdate);  

module.exports = router;
