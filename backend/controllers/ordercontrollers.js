const orderModel = require("../models/orderschema");
const productModel = require("../models/productschema");


// Create a new order
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
        const userId = req.user._id || req.user.id;

        const orderData = {
            userId,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentStatus: "paid"
        };

        const order = await orderModel.create(orderData);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get orders for a specific farmer (products they sell)
const getFarmerOrders = async (req, res) => {
    try {
        const farmerId = req.user._id || req.user.id;

        // Get all products by this farmer
        const farmerProducts = await productModel.find({ farmerId });
        const productIds = farmerProducts.map(p => p._id);

        // Find orders containing these products
        const orders = await orderModel.find({
            "items.productId": { $in: productIds }
        })
        .populate("userId", "name email")
        .populate("items.productId", "name price category")
        .sort({ createdAt: -1 });

        // Filter items to only show farmer's products
        const filteredOrders = orders.map(order => {
            const relevantItems = order.items.filter(item => 
                productIds.some(id => id.equals(item.productId._id))
            );
            return {
                ...order.toObject(),
                items: relevantItems
            };
        }).filter(order => order.items.length > 0);

        res.json({
            success: true,
            orders: filteredOrders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const orders = await orderModel.find({ userId })
            .populate("items.productId", "name price category image")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error in getUserOrders:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update order status (farmer only)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const farmerId = req.user._id || req.user.id;

        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: "Order ID and status are required"
            });
        }

        // Validate status
        const validStatuses = ["pending", "approved", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        // Find the order and verify it contains farmer's products
        const order = await orderModel.findById(orderId).populate("items.productId");
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Verify farmer owns at least one product in the order
        const farmerProducts = await productModel.find({ farmerId });
        const farmerProductIds = farmerProducts.map(p => p._id.toString());
        const hasFarmerProduct = order.items.some(item => 
            farmerProductIds.includes(item.productId._id.toString())
        );

        if (!hasFarmerProduct) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this order"
            });
        }

        const previousStatus = order.status;

        // Update order status
        order.status = status;
        order.updatedAt = Date.now();
        await order.save();

        // If status changed to 'approved', reduce stock for farmer's products
        if (status === 'approved' && previousStatus !== 'approved') {
            for (const item of order.items) {
                const productId = item.productId._id.toString();
                
                // Only reduce stock for farmer's products
                if (farmerProductIds.includes(productId)) {
                    const product = await productModel.findById(productId);
                    
                    if (product) {
                        // Check if enough stock is available
                        if (product.stock < item.quantity) {
                            return res.status(400).json({
                                success: false,
                                message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`
                            });
                        }
                        
                        // Reduce stock
                        product.stock -= item.quantity;
                        await product.save();
                    }
                }
            }
            
            // Send approval email to user
            const userModel = require('../models/userschema');
            const user = await userModel.findById(order.userId);
            if (user && user.email) {
                await sendOrderApprovedEmail(user.email, user.name, order._id.toString());
            }
        }

        // If status changed to 'delivered', send delivery email
        if (status === 'delivered' && previousStatus !== 'delivered') {
            const userModel = require('../models/userschema');
            const user = await userModel.findById(order.userId);
            
            if (user && user.email) {
                // Prepare order details for email
                const orderDetails = {
                    items: order.items.map(item => ({
                        productName: item.productId.name,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    totalAmount: order.totalAmount
                };
                
                await sendOrderDeliveredEmail(
                    user.email,
                    user.name,
                    order._id.toString(),
                    orderDetails
                );
            }
        }

        res.json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createOrder, getFarmerOrders, getUserOrders, updateOrderStatus };
