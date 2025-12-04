const productModel =require("../models/productschema")
const {v2 : cloudinary} = require("cloudinary");

const addproduct = async (req, res) => {
    try {
        const { name, price, description, category, stock } = req.body;
        
        // Validate required fields
        if (!name || !price || !description || !category || !stock) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const image1 = req.files?.image1 && req.files.image1[0]
        const image2 = req.files?.image2 && req.files.image2[0]
        const image3 = req.files?.image3 && req.files.image3[0]
        const images = [image1, image2, image3].filter(img => img !== undefined);

        let imagesurl = [];
        if (images.length > 0) {
            imagesurl = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                    return result.secure_url
                })
            )
        }
        
        const productdata = {
            name,
            price: Number(price),
            description,
            image: imagesurl,
            category,
            stock: Number(stock),
            farmerId: req.user._id || req.user.id,
            date: Date.now()
        }
        
        const product = await productModel.create(productdata)
       
        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product
        });
    } catch (error) {
        console.error("Error in addproduct:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
const listproduct = async (req, res) => {
 const products = await productModel.find().populate('farmerId', 'name email')
 res.json({
    success:true,
    message:"Product list",
    products
 })
}
const removeproduct = async (req, res) => {
 const product = await productModel.findByIdAndDelete(req.params.id)
 res.json({
    success:true,
    message:"Product removed successfully",
    product
 })
}
const singleproduct = async (req, res) => {
 const product = await productModel.findById(req.params.id).populate('farmerId', 'name email')
 res.json({
    success:true,
    message:"Product found successfully",
    product
 })
}

const getFarmerProducts = async (req, res) => {
    try {
        const farmerId = req.user._id || req.user.id;
        const products = await productModel.find({ farmerId }).sort({ createdAt: -1 });
        res.json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const updateProductStock = async (req, res) => {
    try {
        const { productId, stock } = req.body;
        const farmerId = req.user._id || req.user.id;

        if (!productId || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: "Product ID and stock are required"
            });
        }

        // Find product and verify ownership
        const product = await productModel.findById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Verify farmer owns this product
        if (product.farmerId.toString() !== farmerId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this product"
            });
        }

        // Update stock
        product.stock = Number(stock);
        product.updatedAt = Date.now();
        await product.save();

        res.json({
            success: true,
            message: "Stock updated successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { singleproduct, removeproduct, listproduct, addproduct, getFarmerProducts, updateProductStock }