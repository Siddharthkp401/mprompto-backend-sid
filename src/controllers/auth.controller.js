import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import { authService, userService, tokenService, emailService, companyService } from '../services/index.js';
import { Otp, User, TempUser } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import moment from 'moment';
import config from '../config/config.js';
import tokenTypes from '../config/tokens.js';
import GoogleStrategy from 'passport-google-oauth2';
import generateOtp from '../services/otpService.js';
import { sendSMS } from '../helper/helper-function.js'


const signIn = catchAsync(async (req, res) => {

  //find from user table
  if (await User.findOne({ email: req.body.email })) {
    await sendOtp(req.body.email)

    return await res.status(httpStatus.CREATED).send({
      success: false, message: 'Please check your mail for OTP!', data: []
    });
  } else {

    const tempUserData = await userService.createTempUser(req.body);
    if (!tempUserData) {
      return res.status(httpStatus.BAD_REQUEST).send({ success: false, message: 'User registration failed', data: [] })
    }
    await sendOtp(req.body.email)
      return await res.status(httpStatus.CREATED).send({
        success: false, message: 'Please check your mail for OTP!', data: tempUserData
      });

  }
});


const sendOtp = catchAsync(async (email) => {

  // if (req.body.mobile_number) {

  //   let OTP = await generateOtp(req.body.mobile_number, null);    //send otp in mobile_number

  //   let smsSuccess = await sendSMS(req.body.mobile_number, OTP)

  //   if (smsSuccess) {

  //     return res.status(httpStatus.OK).send({ success: true, message: 'Please check sms for otp', data: [] })

  //   } else {

  //     return res.status(httpStatus.BAD_GATEWAY).send({ success: true, message: 'Error sending otp in sms', data: [] })

  //   }
  // }


  // let userExist = await TempUser.findOne(email)
  // if (userExist) {

  let OTP = await generateOtp(email);

  //send otp in mail
  let mailSubject = 'OTP verification mail'
  let mailBody = `Please find your OTP for verification : ${OTP}`
  let mailSuccess = await emailService.sendEmail(email, mailSubject, mailBody)

  if (!mailSuccess) {
    throw Error('Error in sending mail!')
  }
return mailSuccess

})

const verifyOtp = catchAsync(async (req, res) => {

  const { otp, email } = req.body
  let otpExist;

  if (email) {
    otpExist = await Otp.findOne({ email: req.body.email, otp: otp, expires_at: { $gte: new Date() } }).lean()
    .sort({ date: -1 });
  }

  if (!otpExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Otp!')
  }
  let tempUser = await TempUser.findOne({ email: email })

  let userExist = await userService.getUserByEmail(email)
  let postUser;
  if (!userExist) {

    // make user table entry
    const userObj = {
      // fullname: tempUser.fullname,
      email: tempUser.email,
      // mobile_number: tempUser.mobile_number,
      // otp_verified: true,
    };
    postUser = await userService.createUser(userObj);
    await userService.deleteTempUserByEmail(email)

    // make company table entry
    const companyObj = {
      user_id: postUser._id,
      // company_name: tempUser.company_name
    };
    await companyService.createCompany(companyObj);

  }



  const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const userToken = await tokenService.generateToken(userExist ? userExist._id : postUser._id, expires);
  res.status(httpStatus.OK).send({ success: true, message: 'Otp verified successfully', data: { token: userToken } })

})


const login = catchAsync(async (req, res) => {
  // const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({ success: true, message: 'User login successfull', data: { user, tokens } });
});

// const register = catchAsync(async (req, res) => {

//   let { email } = req.body
//   let userExist = await User.findOne(email)

//   if (userExist) {
//     let verify_email_token = await tokenService.generateVerifyEmailToken(tempUserData)
//     emailService.sendVerificationEmail(tempUserData.email, verify_email_token)

//     return await res.status(httpStatus.CREATED).send({
//       success: false, message: 'User registered successfully', data: tempUserData, verify_email_token
//     });
//   } else {

//   }



// })

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

  let tempUser = await TempUser.findOne({ email: req.body.email })

  const verifyEmailToken = await tokenService.generateVerifyEmailToken(tempUser);

  await emailService.sendVerificationEmail(tempUser.email.trimRight(), verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send({ success: true, message: 'Email sent successfully', data: [] });
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.OK).send({ success: true, message: 'Email verified successfully', data: [] });
});




//login with google

const loginWithGoogle = async () => {
  await passport.use(new GoogleStrategy({
    clientID: config.googleAuth.client_id,
    clientSecret: config.googleAuth.client_secret,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback",
    passReqToCallback: true
  },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ social_login_id: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  ));
}

export default {
  signIn,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  sendOtp,
  verifyOtp,
  loginWithGoogle
};
