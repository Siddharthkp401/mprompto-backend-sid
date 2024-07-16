const User = require("../models/user");
const { saveOTP } = require("../utils/otp");
const { sendMail } = require("../utils/email");
const {
  registerUserSchema,
} = require("../validationSchemas/validationSchemas");

exports.registerUser = async (req, res) => {
  try {
    const { error } = registerUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
        data: null,
      });
    }

    const { email, country_code, mobile_number, fullname } = req.body;

    // Check if user with the same email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
        data: null,
      });
    }

    // Create new user
    user = new User({
      email,
      country_code,
      mobile_number,
      fullname,
    });
    await user.save();

    // Generate OTP and send via email
    const otp = await saveOTP(email, mobile_number, user._id);
    await sendMail(
      email,
      "OTP for Registration",
      `Your OTP for registration is: ${otp}`
    );

    res.status(200).json({
      status: true,
      message: "User registered successfully",
      data: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};
