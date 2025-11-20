const jwt = require("jsonwebtoken");
const userModel = require("../models/userschema");
const farmerModel = require("../models/farmerschema");
const adminModel = require("../models/adminschema");

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // For admin login (email-based token)
    if (decoded.email) {
      req.user = { email: decoded.email, role: "admin" };
      return next();
    }
    
    // Check role and find user in appropriate collection
    let user;
    if (decoded.role === "farmer") {
      user = await farmerModel.findById(decoded.id).select("-password");
    } else if (decoded.role === "admin") {
      user = await adminModel.findById(decoded.id).select("-password");
    } else {
      user = await userModel.findById(decoded.id).select("-password");
    }
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    req.user = { ...user.toObject(), role: decoded.role };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check if user has required role
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(" or ")}` 
      });
    }
    
    next();
  };
};

module.exports = { verifyToken, checkRole };
