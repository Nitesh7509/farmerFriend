const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const adminModel = mongoose.model("Admin", adminSchema);
module.exports = adminModel;
