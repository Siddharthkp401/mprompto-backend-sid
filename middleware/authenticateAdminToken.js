// THIS IS FOR USER AND ADMIN MIDDLWARE FUNCTIONS

const jwt = require("jsonwebtoken");
const { JWT_SECRET, ADMIN_JWT_SECRET } = require("../config/jwt");
const User = require("../models/user.schema");
const Admin = require("../models/admin/admin.schema");

const authenticateAdminToken = (type = "user") => {
  const secrets = {
    user: JWT_SECRET,
    admin: ADMIN_JWT_SECRET,
  };

  const models = {
    user: User,
    admin: Admin,
  };

  return async (req, res, next) => {
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

    const secretKey = secrets[type];
    const Model = models[type];

    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        console.error(`Error verifying ${type} token:`, err);
        return res.status(403).json({
          status: false,
          message: "Invalid token",
          data: null,
        });
      }

      try {
        const entity = await Model.findById(decoded.id); 
        if (!entity) {
          return unauthorizedResponse(res, `${type.charAt(0).toUpperCase() + type.slice(1)} not found`);
        }

        req[type] = entity; 
        next();
      } catch (error) {
        res.status(500).json({
          status: false,
          message: "Internal server error",
          data: null,
        });
      }
    });
  };
};

module.exports = { authenticateAdminToken };
