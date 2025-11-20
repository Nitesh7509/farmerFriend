const express = require("express");
const { createOrder, getFarmerOrders, getUserOrders, updateOrderStatus } = require("../controllers/ordercontrollers");
const { verifyToken, checkRole } = require("../middlewares/auth");

const orderRouter = express.Router();

// Create order (authenticated users)
orderRouter.post("/create", verifyToken, createOrder);

// Get farmer's orders (farmer only)
orderRouter.get("/farmer-orders", verifyToken, checkRole("farmer"), getFarmerOrders);

// Get user's orders
orderRouter.get("/user-orders", verifyToken, getUserOrders);

// Update order status (farmer only)
orderRouter.put("/update-status", verifyToken, checkRole("farmer"), updateOrderStatus);

module.exports = orderRouter;
