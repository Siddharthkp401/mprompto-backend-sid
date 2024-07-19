const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../../middleware/authenticate");
const userController = require("../../controllers/userController");
const registerController = require("../../controllers/registerController");
const verifyOtpController = require("../../controllers/verifyOtpController");
const { addExternalURL } = require("../../controllers/externalURLController");
const { addFile } = require("../../controllers/fileController");
const { addFAQ } = require("../../controllers/faqController");
const { listCompanyContent } = require("../../controllers/contentController");
const {
  addCustomizationData,
} = require("../../controllers/customizationController");

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

router.post(
  "/add-external-url",
  authenticateToken,
  upload.single("file"),
  addExternalURL
);
router.post("/add-file", authenticateToken, upload.single("file"), addFile);
router.post("/add-faq", authenticateToken, upload.single("file"), addFAQ);

router.get("/content-listing", authenticateToken, listCompanyContent);

router.post(
  "/customize-data-add",
  authenticateToken,
  upload.single("logo"), 
  addCustomizationData
);
module.exports = router;
