const DemoClient = require("../../models/demo/client.schema");
const OTP = require("../../models/demo/otp.schema");
const { sendMail } = require("../../utils/demo/demo_email");

exports.clientLogin = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        const client = await DemoClient.findOne({ name, email_ids: email });

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        // Check if the status is 'Active'
        if (client.status !== 'Active') {
            return res.status(404).json({ message: "Status is not active" });
        }

        // Check if the data array exists and is not empty
        if (!Array.isArray(client.data) || client.data.length === 0) {
            return res.status(404).json({ message: "Product details not found" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        const otpDoc = new OTP({
            name: name,
            email: email,
            otp: otp,
            expiresAt: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
        });

        await otpDoc.save();

        try {
            await sendMail(email, "Your OTP Code", otp);
            res.status(200).json({ message: "OTP sent successfully" });
        } catch (emailError) {
            console.error("Email Error:", emailError);
            return res.status(500).json({ message: "Failed to send OTP", error: emailError.message });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
