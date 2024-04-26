import express from 'express';
import uploadFile from '../../middlewares/fileUpload.js';
import { fileContentController } from '../../controllers/index.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();
router.route('/').post(auth(), uploadFile, fileContentController.uploadFileContent);

export default router;
