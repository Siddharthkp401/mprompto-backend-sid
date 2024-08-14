const User = require("../models/user");

exports.viewProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "User profile retrieved successfully",
      data: {
        email: user.email,
        country_code: user.country_code,
        mobile_number: user.mobile_number,
        name: user.name,
        role_id: user.role_id,
        company_id: user.company_id,
        email_verified: user.email_verified,
        otp_verified: user.otp_verified,
      },
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
