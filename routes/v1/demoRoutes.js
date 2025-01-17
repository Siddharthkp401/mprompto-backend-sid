const express = require("express");
const router = express.Router();
const clientController = require("../../controllers/demo/client.controller");
const getClientController = require("../../controllers/demo/getclientinfo.controller")

// Public routes
router.post("/clients/create-or-update", clientController.createOrUpdate);
router.get("/clients/get", getClientController.getClients);


module.exports = router;
