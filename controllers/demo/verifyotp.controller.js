const OTP = require("../../models/demo/otp.schema");
const DemoClient = require("../../models/demo/client.schema");

exports.verifyOtp = async (req, res) => {
    try {
        const { name, email, otp } = req.body;

        if (!name || !email || !otp) {
            return res.status(400).json({ message: "Name, email, and OTP are required" });
        }

        const otpDoc = await OTP.findOne({ name, email, otp });

        if (!otpDoc) {
            return res.status(404).json({ message: "Invalid name, email, or OTP" });
        }

        if (otpDoc.expiresAt < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        otpDoc.isVerified = true;
        await otpDoc.save();

        const clientData = await DemoClient.findOne({
            name,
            email_ids: email,
        });

        if (!clientData) {
            return res.status(404).json({ message: "No client data found for the provided name and email" });
        }

        return res.status(200).json({
            message: "OTP verified successfully",
            data: clientData,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
