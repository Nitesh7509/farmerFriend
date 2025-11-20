const { v2: cloudinary } = require('cloudinary');

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_SECRET, 
  });
};

module.exports = connectCloudinary;
