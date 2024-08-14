const User = require("../models/user");

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; 

    const { name, country_code, mobile_number } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        country_code,
        mobile_number,
        updated_at: Date.now(),
      },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "User profile updated successfully",
      data: {
        email: updatedUser.email,
        country_code: updatedUser.country_code,
        mobile_number: updatedUser.mobile_number,
        name: updatedUser.name,
        role_id: updatedUser.role_id,
        company_id: updatedUser.company_id,
        email_verified: updatedUser.email_verified,
        otp_verified: updatedUser.otp_verified,
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
