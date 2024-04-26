import httpStatus from 'http-status';
import { FileContent } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import companyContentService from './companyContent.service.js';

/**
 * Create a user in TempUser table
 * @param {Object} fileContentBody
 * @returns {Promise<fileContent>}
 */

const uploadFile = async (obj, file) => {
  const companyContentObj = {
    company_id: obj.company_id,
    content_type: 2,
    language: obj.language,
  };
  const companyContent = await companyContentService.uploadContent(companyContentObj);

  if (!companyContent) {
    throw new ApiError('Error while posting company content!');
  }

  const fileObj = {
    company_content_id: companyContent._id,
    title: file.originalname,
    filename: file.originalname,
    filepath: file.location,
    filesize: file.size,
  };

  const uploadFileContent = await FileContent.create(fileObj);

  if (!uploadFileContent) {
    throw new ApiError('Error uploading file!');
  }

  return uploadFile;
};

export default { uploadFile };
