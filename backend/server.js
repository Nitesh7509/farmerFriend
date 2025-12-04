const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./configs/mongoose");
const connectCloudinary = require("./configs/cloudinary");
const cors = require("cors");

// CORS configuration - allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://farmer-friend-fbw2atc3l-nitesh-patels-projects-91f8139b.vercel.app",
  process.env.FRONTEND_URL_PROD
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Remove trailing slash from origin for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    // Check if the origin is in the allowed list (with or without trailing slash)
    const isAllowed = allowedOrigins.some(allowed => {
      const normalizedAllowed = allowed.replace(/\/$/, '');
      return normalizedOrigin === normalizedAllowed;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

connectDB();
connectCloudinary();

// Initialize admin user from .env
const initAdmin = async () => {
    try {
        const adminModel = require('./models/adminschema');
        const bcrypt = require('bcryptjs');
        
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminName = process.env.ADMIN_NAME || 'Administrator';

        if (adminEmail && adminPassword) {
            const existingAdmin = await adminModel.findOne({ email: adminEmail });
            
            if (!existingAdmin) {
                const hashedPassword = await bcrypt.hash(adminPassword, 10);
                await adminModel.create({
                    name: adminName,
                    email: adminEmail,
                    password: hashedPassword
                });
                console.log('✅ Admin user initialized from .env');
            }
        }
    } catch (error) {
        console.error('Admin initialization error:', error.message);
    }
};

// Call after DB connection
setTimeout(initAdmin, 1000);

app.use("/api/user", require("./routes/userroute"));
app.use("/api/product", require("./routes/productroute"));
app.use("/api/order", require("./routes/orderroute"));
app.use("/api/contact", require("./routes/contactroute"));
app.use("/api/feedback", require("./routes/feedbackroute"));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
