const jwt = require("jsonwebtoken");
const AdminToken = require("../../models/admin/admintoken.schema");
const { ADMIN_JWT_SECRET } = require("../../config/jwt");

exports.logoutAdmin = async (req, res) => {
    try {
        const adminId = req.admin._id; 
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; 

        if (!token) {
            return res.status(400).json({ message: "Token missing from request." });
        }

        jwt.verify(token, ADMIN_JWT_SECRET, async (err) => {
            if (err) {
                console.error("Token verification failed:", err);
                return res.status(403).json({
                    status: false,
                    message: "Invalid token",
                });
            }

            const adminToken = await AdminToken.findOne({ adminId });

            if (!adminToken) {
                return res.status(404).json({
                    status: false,
                    message: "Admin token not found.",
                });
            }

            if (adminToken.token !== token) {
                return res.status(403).json({
                    status: false,
                    message: "Token does not match the stored token for this admin.",
                });
            }

            await AdminToken.findOneAndDelete({ adminId });

            res.status(200).json({
                status: true,
                message: "Admin logged out successfully.",
            });
        });
    } catch (error) {
        console.error("Error logging out admin:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
