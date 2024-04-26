import express from 'express';
import uploadFile from '../../middlewares/fileUpload.js';
import auth from '../../middlewares/auth.js';
import companyContentController from '../../controllers/companyContent.controller.js';

const router = express.Router();
router.route('/')
    .post(auth(), uploadFile, companyContentController.postCompanyContent)
    .get(auth(), companyContentController.getCompanyContent);

export default router;