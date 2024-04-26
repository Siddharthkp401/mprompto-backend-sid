import httpStatus from 'http-status';
import { UrlContent } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

/**
 * Create a user in TempUser table
 * @param {Object} UrlContentBody
 * @returns {Promise<UrlContent>}
 */

const postUrlData = async (obj) => {
  const postUrl = await UrlContent.create(obj);

  if (!postUrl) {
    throw new ApiError('Error uploading content url!');
  }
  return postUrl;
};

const fetchUrl = async () => {
  const urlData = await UrlContent.find();
  if (!urlData) {
    throw new ApiError('Error uploading content url!');
  }
  return urlData;
};

export default { postUrlData, fetchUrl };
