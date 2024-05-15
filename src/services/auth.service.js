import httpStatus from 'http-status';
import tokenService from './token.service.js';
import userService from './user.service.js';
import companyService from './company.service.js';
import Token from '../models/otp.model.js';
import ApiError from '../utils/ApiError.js';
import tokenTypes from '../config/tokens.js';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (body) => {
  if (body.social_login_id && body.login_with) {
    // fetch user data from selected app
  }

  const user = await userService.getUserByEmail(body.email);

  if (!user || !(await user.isPasswordMatch(body.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const tempUser = await userService.getTempUserById(verifyEmailTokenDoc.temp_user);
    if (!tempUser) {
      throw new Error('User not found!');
    }
    await Token.deleteMany({ user_id: tempUser._id, type: tokenTypes.VERIFY_EMAIL });

    // update temp user table with email verified true
    await userService.updateTempUserById(tempUser._id, { email_verified: true });

      // make user table entry
    const userObj = {
      fullname: tempUser.fullname,
      email: tempUser.email,
      mobile_number: tempUser.mobile_number,
      password: tempUser.password,
      email_verified: true,
    };
    const postUser = await userService.createUser(userObj);
    if (!postUser) {
      throw ApiError('User create failed');
    }

    // make company table entry
    const companyObj = {
      user_id: postUser._id,
      company_name: tempUser.company_name,
      min_company_size: tempUser.min_company_size,
      max_company_size: tempUser.max_company_size,
      company_website: tempUser.company_website,
    };
    const postComapny = await companyService.createCompany(companyObj);
    if (!postComapny) {
      throw ApiError('Post Company failed');
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

export default {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
