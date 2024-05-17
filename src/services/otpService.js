// import httpStatus from 'http-status';
import { Otp } from '../models/index.js';

// const AWS = require('aws-sdk');

// const sns = new AWS.SNS()

function AddMinutesToDate(date, minutes) {
  // set expiration time of 10 minutes
  return new Date(date.getTime() + minutes * 60000);
}

function generateRandomNumber(min, max) {
  // generated otp
  return Math.floor(Math.random() * (max - min) + min);
}

const generateOtp = async (/* mobile_number, */ email) => {
  try {
    const otp = generateRandomNumber(100000, 999999);
    const now = new Date();
    const otpExpirationTime = AddMinutesToDate(now, 10);

    let otpInfo = {};
    // if (mobile_number !== null) {
    //   const oldOtp = await Otp.find({ mobile_number });

    //   if (oldOtp.length > 0) {
    //     await Otp.deleteMany({ mobile_number });
    //   }
    //   otpInfo = {
    //     mobile_number,
    //     otp,
    //     // now,
    //     expires_at: otpExpirationTime,
    //   };
    // }
    // for email
    if (email !== null) {
      const oldOtp = await Otp.find({ email });

      if (oldOtp.length > 0) {
        await Otp.deleteMany({ email });
      }
      otpInfo = {
        email,
        otp,
        // now,
        expires_at: otpExpirationTime,
      };
    }

    const otpCreation = await Otp.create(otpInfo);
    if (!otpCreation) {
      throw new Error('Error while generating OTP!');
    }
    return otp;
  } catch (error) {
    throw new Error(error);
  }
};

export default generateOtp;
