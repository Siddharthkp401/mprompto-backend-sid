import httpStatus from 'http-status';
import { companyService, urlServices } from '../services/index.js';
import catchAsync from '../utils/catchAsync.js';
import companyContentService from '../services/companyContent.service.js';

const postExternalUrl = catchAsync(async (req, res) => {
  const reqData = req.body;

  const userCompanyId = await companyService.fetchUserCompany(req.user._id);

  const companyContentObj = {
    company_id: userCompanyId._id,
    content_type: 1,
  };
  const companyContent = await companyContentService.uploadCompanyContent(companyContentObj);

  reqData.company_content_id = companyContent._id;

  const urlData = await urlServices.postUrlData(reqData);

  if (!urlData) {
    res.status(httpStatus.BAD_GATEWAY).send({ success: false, message: 'Post Content url failed!', data: [] });
  }

  res.status(httpStatus.OK).send({ success: false, message: 'Post Content url successfull!', data: urlData });
});

const fetchContentUrls = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send({ success: true, message: 'Content urls fetched successfully!', data: urlData });
});

export default {
  postExternalUrl,
  fetchContentUrls,
};
