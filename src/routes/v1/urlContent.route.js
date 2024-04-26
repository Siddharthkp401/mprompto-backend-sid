import express from 'express';
import uploadFile from '../../middlewares/fileUpload.js';
import { companyContentController } from '../../controllers/index.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();
router.route('/').post(auth(), uploadFile, companyContentController.postCompanyContent);

export default router;
