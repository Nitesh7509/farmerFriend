const express = require('express')
const { addproduct, listproduct, removeproduct, singleproduct, getFarmerProducts, updateProductStock } = require('../controllers/productcontrollers')
const upload = require('../middlewares/multer')
const { verifyToken, checkRole } = require('../middlewares/auth')
const productRoute = express.Router()

productRoute.post("/addproduct", verifyToken, checkRole("farmer", "admin"), upload.fields([{name:"image1",maxCount:1}, {name:"image2",maxCount:1},{name:"image3",maxCount:1}]), addproduct)
productRoute.post("/listproduct", listproduct)
productRoute.post("/removeproduct", removeproduct)
productRoute.post("/singleproduct", singleproduct)
productRoute.get("/farmer-products", verifyToken, checkRole("farmer"), getFarmerProducts)
productRoute.put("/update-stock", verifyToken, checkRole("farmer"), updateProductStock)

module.exports = productRoute;