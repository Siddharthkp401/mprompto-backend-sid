import httpStatus from 'http-status';
import { FileContent } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import companyContentService from './companyContent.service.js';

/**
 * Create a user in TempUser table
 * @param {Object} fileContentBody
 * @returns {Promise<fileContent>}
 */

const uploadFile = async (reqData, file) => {

  // const fileObj = {
  //   company_content_id: companyContent._id,
  //   title: file.originalname,
  //   filename: file.originalname,
  //   filepath: file.location,
  //   filesize: file.size,
  // };

  const fileObj = {
    company_content_id: reqData.company_content_id,
    filepath: `http://localhost:3000/src/temp/${file}`
  }

  const uploadFileContent = await FileContent.create(fileObj);

  if (!uploadFileContent) {
    throw new ApiError('Error uploading file!');
  }

  return uploadFileContent;
};

export default { uploadFile };
