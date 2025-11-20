const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: [{ type: String }],
    category: String,
    stock: Number,
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;


