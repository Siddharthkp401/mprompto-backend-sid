import Joi from 'joi';
import { password } from './custom.validation.js';

const register = {
  body: Joi.object().keys({
    fullname: Joi.string(),
    email: Joi.string().required().email(),
    mobile_number: Joi.number()
      .integer()
      .min(10 ** 9)
      .max(10 ** 10 - 1),
    password: Joi.string().custom(password),
    company_name: Joi.string(),
    min_company_size: Joi.number(),
    max_company_size: Joi.number(),
    company_website: Joi.string(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  })
}

const sendOtp = {
  // query: Joi.object().keys({
  //   token: Joi.string().required(),
  // }),

  body: Joi.object().keys({
    email: Joi.string().email().allow(''),
    mobile_number: Joi.number()
      .integer()
      .min(10 ** 9)
      .max(10 ** 10 - 1).allow(''),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    mobile_number: Joi.number()
      .integer()
      .min(10 ** 9)
      .max(10 ** 10 - 1).allow('').describe('Mobile number must be of 10 digits'),
    email: Joi.string().allow(''),
    otp: Joi.number().required().min(6),
  }),
};

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  verifyOtp,
  sendOtp,
};
