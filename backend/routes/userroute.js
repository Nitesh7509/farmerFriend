const express = require("express");
const userRouter = express.Router();
const { 
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
} = require("../controllers/usercontroller");
const { verifyToken, checkRole } = require("../middlewares/auth");

// Public routes
userRouter.post("/register", registeruser);
userRouter.post("/login", loginuser);
userRouter.post("/adminlogin", adminLogin);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

// Protected routes - require authentication
userRouter.get("/verify-token", verifyToken, verifyTokenRoute);
userRouter.get("/profile", verifyToken, getUserProfile);
userRouter.put("/profile", verifyToken, updateProfile);
userRouter.put("/change-password", verifyToken, changePassword);
userRouter.post("/home", verifyToken, home);

// Role-specific routes
userRouter.get("/farmer-dashboard", verifyToken, checkRole("farmer"), (req, res) => {
  res.json({ message: "Welcome to Farmer Dashboard", user: req.user });
});

userRouter.get("/admin-dashboard", verifyToken, checkRole("admin"), (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard", user: req.user });
});

// Admin routes
userRouter.get("/admin/users", verifyToken, checkRole("admin"), getAllUsers);
userRouter.get("/admin/farmers", verifyToken, checkRole("admin"), getAllFarmers);
userRouter.delete("/admin/user/:userId", verifyToken, checkRole("admin"), deleteUser);
userRouter.get("/admin/stats", verifyToken, checkRole("admin"), getPlatformStats);
userRouter.get("/admin/farmer/:farmerId", verifyToken, checkRole("admin"), getFarmerDetails);

module.exports = userRouter;