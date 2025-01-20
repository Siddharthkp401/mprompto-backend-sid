const Admin = require("../../models/admin/admin.schema");
const bcrypt = require("bcrypt");

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        if (!admin.is_active) {
            return res.status(403).json({ message: "Admin account is inactive." });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        res.status(200).json({
            status: true,
            message: "Admin login successfully.",
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
