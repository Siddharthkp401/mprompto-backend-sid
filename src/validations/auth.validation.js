import Joi from 'joi';
import  {password}  from './custom.validation.js';

const register = {
  body: Joi.object().keys({
    fullname: Joi.string().required(),
    email: Joi.string().required().email(),
    mobile_number: Joi.number().required().integer().min(10 ** 9).max(10 ** 10 - 1),
    password: Joi.string().required().custom(password),
    company_name: Joi.string().required(),
    min_company_size: Joi.number().required(),
    max_company_size: Joi.number().required(),
    company_website: Joi.string().required(),
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
    email: Joi.string().email(),
    mobile_number: Joi.number().integer().min(10 ** 9).max(10 ** 10 - 1),
    otp: Joi.number().required().max(6).min(6)
  })
};

const verifyOtp = {
  body: Joi.object().keys({
    mobile_number: Joi.number().integer().min(10 ** 9).max(10 ** 10 - 1),
    otp: Joi.number().required().min(6)
  })
}


export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  verifyOtp,
  sendOtp
};
