const OTP = require("../models/otp");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const saveOTP = async (email, mobile_number, user_id) => {
  const otp = generateOTP();
  const expires_at = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
  const newOTP = new OTP({ user_id, email, otp, expires_at });
  await newOTP.save();
  return otp;
};

const verifyOTP = async (email, otp) => {
  const otpRecord = await OTP.findOne({
    email,
    otp,
    expires_at: { $gt: new Date() },
  });
  if (!otpRecord) {
    throw new Error("Invalid OTP or OTP expired");
  }
  otpRecord.otp_verified = true;
  await otpRecord.save();
  return otpRecord;
};

module.exports = { generateOTP, saveOTP, verifyOTP };
