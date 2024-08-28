const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../../middleware/authenticate");
const userController = require("../../controllers/userController");
const viewProfileController = require("../../controllers/viewProfileController");
const updateProfileController = require("../../controllers/updateProfileController");
const registerController = require("../../controllers/registerController");
const verifyOtpController = require("../../controllers/verifyOtpController");
const { addExternalURL } = require("../../controllers/externalURLController");
const { addDocument } = require("../../controllers/documentController");
const { addFAQ } = require("../../controllers/faqController");
const { listCompanyContent } = require("../../controllers/contentController");
const {
  addCustomizationData,
} = require("../../controllers/customizationController");

const {
  getCustomizationData,
} = require("../../controllers/getCustomizationData");

const { getTotalCounts } = require("../../controllers/CountController");

const upload = require("../../utils/multerConfig");
const { logoutUser } = require("../../controllers/logoutController");

// Public routes
router.post("/check-mail", registerController.registerUser);
router.post("/verify-otp", verifyOtpController.verifyOTP);

// Protected routes
router.put(
  "/save-basic-information",
  authenticateToken,
  userController.updateUserAndCreateCompany
);

router.get(
  "/view-profile",
  authenticateToken,
  viewProfileController.viewProfile
);

router.put(
  "/update-profile",
  authenticateToken,
  upload.single("profilePicture"),
  updateProfileController.updateProfile
);

router.post(
  "/add-external-url",
  authenticateToken,
  upload.single("file"),
  addExternalURL
);
router.post(
  "/add-document",
  authenticateToken,
  upload.single("file"),
  addDocument
);
router.post("/add-faq", authenticateToken, upload.single("file"), addFAQ);

router.get("/content-listing", authenticateToken, listCompanyContent);

router.post(
  "/customize-data-add",
  authenticateToken,
  upload.single("logo"),
  addCustomizationData
);

router.get("/get-customizations", authenticateToken, getCustomizationData);

router.get("/total-counts", authenticateToken, getTotalCounts);

router.post("/logout", authenticateToken, logoutUser);

module.exports = router;
