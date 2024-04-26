import httpStatus from 'http-status';
import { companyService, fileContentService } from '../services/index.js';
import catchAsync from '../utils/catchAsync.js';

const uploadFileContent = catchAsync(async (req, res) => {
  const reqData = req.body;

  // fetch user's company id
  const userCompanyId = await companyService.fetchUserCompany(req.user._id);
  reqData.comapny_id = userCompanyId._id;
  const storeData = await fileContentService.uploadFile(req.body, req.files[0]);

  if (storeData) {
    res.status(httpStatus.OK).send({ success: true, message: 'File uploaded successfully!' });
  }
});

export default {
  uploadFileContent,
};
