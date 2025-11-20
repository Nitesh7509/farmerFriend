const express = require("express");
const { createRazorpayOrder, verifyRazorpayPayment } = require("../controllers/paymentcontroller");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

router.post("/create-order", verifyToken, createRazorpayOrder);
router.post("/verify-payment", verifyToken, verifyRazorpayPayment);

module.exports = router;
