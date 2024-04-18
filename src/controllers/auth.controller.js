const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { generateOtp } = require('../services/otpService');
const { Otp, User, TempUser } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../services/token.service');
const moment = require('moment');
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');


const register = catchAsync(async (req, res) => {
  const tempUserData = await userService.createTempUser(req.body);
  // const tokens = await tokenService.generateAuthTokens(user);
  if (!tempUserData) {
    return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'User registration failed', data: [] })
  }

  let verify_email_token = await tokenService.generateVerifyEmailToken(tempUserData)
  emailService.sendVerificationEmail(tempUserData.email, verify_email_token)

  return await res.status(httpStatus.CREATED).send({
    success: false, message: 'User registered successfully', data: tempUserData, verify_email_token
  });
});

const login = catchAsync(async (req, res) => {
  // const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);

  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.OK).send({ success: true, message: 'Email verified successfully', data: [] });
});

const sendOtp = catchAsync(async (req, res) => {

  if (req.body.mobile_number) {

    let OTP = await generateOtp(req.body.mobile_number, null);    //send otp in mobile_number

    let smsSuccess = await sendSMS(req.body.mobile_number, OTP)

    if (smsSuccess) {

      /** send SMS ---------------------- */
      //  await sendSMS(req.body.mobile_number, OTP)

      // return res.status(httpStatus.OK).send({ success: true, message: 'Please check email for otp', data: [] })


      //     if (smsOtp) {
      //         return responseData.sendResponse(
      //             res,
      //             'Otp Sent Successfully!',
      //         );
      //     } else {
      //         return responseData.sendMessage(res, 'Error sending OTP');
      //     }
      // } else {
      //     return responseData.sendMessage(res, 'Error sending OTP');
      // }

      /** -------------------------- */
      return res.status(httpStatus.OK).send({ success: true, message: 'Please check sms for otp', data: [] })

    } else {
      return res.status(httpStatus.BAD_GATEWAY).send({ success: true, message: 'Error sending otp in sms', data: [] })

    }
  }
  if (req.body.email) {

    let OTP = await generateOtp(null, req.body.email);

    //send otp in mail
    let mailSuccess = await emailService.sendVerificationEmail(req.body.email, OTP)

    if (mailSuccess) {
      return res.status(httpStatus.OK).send({ success: true, message: 'Please check email for otp', data: [] })
    } else {
      return res.status(httpStatus.BAD_GATEWAY).send({ success: true, message: 'Error sending otp in mail', data: [] })
    }

  }

})

const verifyOtp = catchAsync(async (req, res) => {

  const { otp, mobile_number } = req.body
  // let otpExist;

  // if (req.body.mobile_number) {
  //   otpExist = await Otp.findOne({ mobile_number: req.body.mobile_number, otp: otp, expires_at: { $gte: new Date() } }).lean()
  //     .sort({ date: -1 });
  // }

  // if (req.body.email) {
  //   otpExist = await Otp.findOne({ email: req.body.email, otp: otp, expires_at: { $gte: new Date() } }).lean()
  //     .sort({ date: -1 });
  // }

  // if (!otpExist) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Otp!')
  // }
  await TempUser.findOneAndUpdate(mobile_number, { otp_verified: true })
  let validUser = await User.findOneAndUpdate(mobile_number, { otp_verified: true }, { returnDocument: 'after' })
  const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const userToken = tokenService.generateToken(validUser._id, expires, tokenTypes.REFRESH);
  res.status(httpStatus.OK).send({ success: true, message: 'Otp verified successfully', data: { token: userToken } })

})


module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  sendOtp,
  verifyOtp
};
