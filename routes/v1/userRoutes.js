const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../../middleware/authenticate");
const userController = require("../../controllers/userController");
const registerController = require("../../controllers/registerController");
const verifyOtpController = require("../../controllers/verifyOtpController");
const { addExternalURL } = require("../../controllers/externalURLController");
const { addFile } = require("../../controllers/fileController");
const { addFAQ } = require("../../controllers/faqController");

const upload = require("../../utils/multerConfig");

// Public routes
router.post("/check-mail", registerController.registerUser);
router.post("/verify-otp", verifyOtpController.verifyOTP);

// Protected routes
router.put(
  "/save-basic-information",
  authenticateToken,
  userController.updateUserAndCreateCompany
);

router.post("/add-external-url", authenticateToken, addExternalURL);
router.post("/add-file", authenticateToken, addFile);
router.post("/add-faq", authenticateToken, upload.single("file"), addFAQ);

module.exports = router;
