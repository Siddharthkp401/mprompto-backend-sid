const OTP = require("../../models/demo/otp.schema");
const { sendMail } = require("../../utils/demo/demo_email");

exports.resendOtp = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        let otpDoc = await OTP.findOne({ name, email });

        if (!otpDoc) {
            return res.status(404).json({ message: "Name and email do not match any existing records" });
        }

        otpDoc.otp = Math.floor(1000 + Math.random() * 9000).toString();
        otpDoc.expiresAt = Date.now() + 5 * 60 * 1000;
        otpDoc.isVerified = false;

        await otpDoc.save();

        try {
            await sendMail(email, "Your OTP Code", otpDoc.otp);
            res.status(200).json({ message: "OTP sent successfully" });
        } catch (emailError) {
            console.error("Email Error:", emailError);
            return res.status(500).json({ message: "Failed to send OTP", error: emailError.message });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
