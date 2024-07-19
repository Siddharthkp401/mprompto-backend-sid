const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");
const User = require("../models/user");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  const unauthorizedResponse = (res, message) => {
    res.status(401).json({
      status: false,
      message: message || "Unauthorized",
      data: null,
    });
  };

  if (!token) {
    return unauthorizedResponse(res, "No token provided");
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.status(403).json({
        status: false,
        message: "Invalid token",
        data: null,
      });
    }

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return unauthorizedResponse(res, "User not found");
      }

      req.user = user;
      // console.log("Authenticated user:", user); // Log the authenticated user
      next();
    } catch (error) {
      // console.error("Error finding user:", error); // Log the error
      res.status(500).json({
        status: false,
        message: "Internal server error",
        data: null,
      });
    }
  });
};

module.exports = { authenticateToken };
