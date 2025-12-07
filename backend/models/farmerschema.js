const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    address: String,
    verified: { type: Boolean, default: true }, // Auto-verify farmers on registration
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const farmerModel = mongoose.model("Farmer", farmerSchema);
module.exports = farmerModel;
