const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../../middleware/authenticate");
const userController = require("../../controllers/user.controller");
const viewProfileController = require("../../controllers/viewProfile.controller");
const updateProfileController = require("../../controllers/updateProfile.controller");
const registerController = require("../../controllers/register.controller");
const verifyOtpController = require("../../controllers/verifyOtp.controller");
const { addExternalURL } = require("../../controllers/externalURL.Controller");
const { addDocument } = require("../../controllers/document.controller");
const { addFAQ } = require("../../controllers/faq.controller");
const { listCompanyContent } = require("../../controllers/content.controller");
const {
  addCustomizationData,
} = require("../../controllers/customization.controller");

const {
  getCustomizationData,
} = require("../../controllers/getCustomizationData.controller");

const { getTotalCounts } = require("../../controllers/count.controller");

const upload = require("../../utils/multerConfig");
const { logoutUser } = require("../../controllers/logout.controller");
const { getCompanyList } = require("../../controllers/getCompanyList.controller");

const { getCompanyContent } = require("../../controllers/getCompanyContent.controller");



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

router.get("/company-list", getCompanyList);

router.post("/get-company-content", getCompanyContent);



module.exports = router;
