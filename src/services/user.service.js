import httpStatus from 'http-status';
import { User, TempUser } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import companyService from './company.service.js';

/**
 * Create a user in TempUser table
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createTempUser = async (userBody) => {
  // if (await TempUser.isEmailTaken(userBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }

  // if (await TempUser.isMobileNumberTaken(userBody.mobile_number)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile Number already taken');
  // }
  return await TempUser.create(userBody)
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (await User.isMobileNumberTaken(userBody.mobile_number)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile Number already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};
/**
 * Get Temp user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getTempUserById = async (id) => {
  return TempUser.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  const company = await companyService.fetchUserCompany(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();


  let companyObj = {
    company_name: updateBody.company_name ? updateBody.company_name : company.company_name,
    min_company_size: updateBody.min_company_size ? updateBody.min_company_size : company.min_company_size,
    max_company_size: updateBody.max_company_size ? updateBody.max_company_size : company.max_company_size,
    company_website: updateBody.company_website ? updateBody.company_website : company.company_website,
  }


  // if (updateBody.company_name) {
  Object.assign(company, companyObj);
  await company.save();
  // }



  return user;
};

/**
 * Update Temp user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateTempUserById = async (userId, updateBody) => {
  const user = await getTempUserById(userId);
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

export default {
  createTempUser,
  createUser,
  queryUsers,
  getUserById,
  getTempUserById,
  getUserByEmail,
  updateUserById,
  updateTempUserById,
  deleteUserById,
};
