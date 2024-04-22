import httpStatus from 'http-status';
import { Otp, User } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import config from '../config/config.js';
import { emailService } from './email.service.js'
// const AWS = require('aws-sdk');

// const sns = new AWS.SNS()


const generateOtp = async (mobile_number, email) => {

    try {
        function AddMinutesToDate(date, minutes) {              //set expiration time of 10 minutes
            return new Date(date.getTime() + minutes * 60000);
        }

        function generateRandomNumber(min, max) {             // generated otp
            return Math.floor(Math.random() * (max - min) + min);
        }

        const otp = generateRandomNumber(100000, 999999);
        const now = new Date();
        const otp_expiration_time = AddMinutesToDate(now, 10);

        let otpInfo = {};
        if (mobile_number !== null) {

            let oldOtp = await Otp.find({ mobile_number: mobile_number })

            if (oldOtp.length > 0) {
                await Otp.deleteMany({ mobile_number: mobile_number })
            }
            otpInfo = {
                mobile_number: mobile_number,
                otp,
                // now,
                expires_at: otp_expiration_time,
            };
        }
        // for email 
        if (email !== null) {

            let oldOtp = await Otp.find({ email: email })

            if (oldOtp.length > 0) {
                await Otp.deleteMany({ email: email })
            }
            otpInfo = {
                email: email,
                otp,
                // now,
                expires_at: otp_expiration_time,
            }
        }

        const otpCreation = await Otp.create(otpInfo);
        if (!otpCreation) {
            throw new Error(error)
        }
        return otp;

    } catch (error) {
        throw new Error(error)
    }
}


export default generateOtp