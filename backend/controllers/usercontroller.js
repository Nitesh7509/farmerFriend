const userModel = require("../models/userschema");
const farmerModel = require("../models/farmerschema");
const adminModel = require("../models/adminschema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../configs/email");

const registeruser = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;
    
    if (!email || !name || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email exists in any collection
    const existingUser = await userModel.findOne({ email });
    const existingFarmer = await farmerModel.findOne({ email });
    const existingAdmin = await adminModel.findOne({ email });

    if (existingUser || existingFarmer || existingAdmin) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    let user;
    if (role === "farmer") {
      user = await farmerModel.create({
        name,
        email,
        password: hashpassword,
      });
    } else if (role === "admin") {
      user = await adminModel.create({
        name,
        email,
        password: hashpassword,
      });
    } else {
      user = await userModel.create({
        name,
        email,
        password: hashpassword,
      });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      user,
      role,
      token,
      message: "Register successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check in all three collections
    let user = await userModel.findOne({ email });
    let role = "user";

    if (!user) {
      user = await farmerModel.findOne({ email });
      role = "farmer";
    }

    if (!user) {
      user = await adminModel.findOne({ email });
      role = "admin";
    }

    if (!user) {
      return res.status(400).json({
        message: "Please enter a valid email and password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Please enter a valid email and password.",
      });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      user,
      role,
      token,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin in Admin collection
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Please enter a valid email and password."
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Please enter a valid email and password."
      });
    }

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      user: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        role: "admin"
      },
      role: "admin",
      token,
      message: "Admin login successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const home = async (req, res) => {
  try {
    res.json({ message: "Welcome to the home page" });
  } catch (error) {
    res.json({ message: error.message });
  }
}

const verifyTokenRoute = async (req, res) => {
  try {
    res.status(200).json({
      valid: true,
      user: req.user
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      message: 'Invalid or expired token'
    });
  }
};

// Admin: Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Get all farmers
const getAllFarmers = async (req, res) => {
  try {
    const farmers = await farmerModel.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      farmers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Delete user or farmer
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Try to delete from user collection
    let user = await userModel.findByIdAndDelete(userId);

    // If not found, try farmer collection
    if (!user) {
      user = await farmerModel.findByIdAndDelete(userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Get platform statistics
const getPlatformStats = async (req, res) => {
  try {
    const productModel = require('../models/productschema');
    const orderModel = require('../models/orderschema');

    const totalUsers = await userModel.countDocuments();
    const totalFarmers = await farmerModel.countDocuments();
    const totalProducts = await productModel.countDocuments();
    const orders = await orderModel.find();

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalFarmers,
        totalProducts,
        totalRevenue,
        totalOrders: orders.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Get farmer details with products and orders
const getFarmerDetails = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const productModel = require('../models/productschema');
    const orderModel = require('../models/orderschema');

    const farmer = await farmerModel.findById(farmerId).select('-password');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Get farmer's products
    const products = await productModel.find({ farmerId });
    const productIds = products.map(p => p._id);

    // Get orders containing farmer's products
    const orders = await orderModel.find({
      "items.productId": { $in: productIds }
    })
      .populate("userId", "name email")
      .populate("items.productId", "name price category")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      farmer,
      products,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user profile (name and email only)
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required"
      });
    }

    // Check if email is already taken by another user
    let existingUser;
    if (userRole === 'farmer') {
      existingUser = await farmerModel.findOne({ email, _id: { $ne: userId } });
    } else {
      existingUser = await userModel.findOne({ email, _id: { $ne: userId } });
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use"
      });
    }

    // Update user in appropriate collection
    let updatedUser;
    if (userRole === 'farmer') {
      updatedUser = await farmerModel.findByIdAndUpdate(
        userId,
        { name, email, updatedAt: Date.now() },
        { new: true }
      ).select('-password');
    } else {
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { name, email, updatedAt: Date.now() },
        { new: true }
      ).select('-password');
    }

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters"
      });
    }

    // Find user in appropriate collection
    let user;
    if (userRole === 'farmer') {
      user = await farmerModel.findById(userId);
    } else {
      user = await userModel.findById(userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    user.updatedAt = Date.now();
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Forgot Password - Send reset email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Find user in both collections
    let user = await userModel.findOne({ email });
    let role = "user";

    if (!user) {
      user = await farmerModel.findOne({ email });
      role = "farmer";
    }

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: "If that email exists, a password reset link has been sent"
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Save hashed token and expiry to user
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    const emailResult = await sendPasswordResetEmail(user.email, user.name, resetToken);
    
    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again later."
      });
    }

    res.json({
      success: true,
      message: "Password reset email sent successfully"
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reset Password with token
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    // Hash the token to compare
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token in both collections
    let user = await userModel.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      user = await farmerModel.findOne({
        resetPasswordToken: resetTokenHash,
        resetPasswordExpire: { $gt: Date.now() }
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.updatedAt = Date.now();
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registeruser,
  loginuser,
  adminLogin,
  getUserProfile,
  home,
  verifyTokenRoute,
  getAllUsers,
  getAllFarmers,
  deleteUser,
  getPlatformStats,
  getFarmerDetails,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
};
