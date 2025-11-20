// Script to initialize admin user from .env file
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adminModel = require('./models/adminschema');

async function initializeAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB');

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminName = process.env.ADMIN_NAME || 'Administrator';

        if (!adminEmail || !adminPassword) {
            console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
            process.exit(1);
        }

        // Check if admin already exists
        const existingAdmin = await adminModel.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('ℹ️  Admin already exists:', adminEmail);
            console.log('✅ No action needed');
        } else {
            // Hash password
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            // Create admin
            const admin = await adminModel.create({
                name: adminName,
                email: adminEmail,
                password: hashedPassword
            });

            console.log('✅ Admin user created successfully!');
            console.log('📧 Email:', admin.email);
            console.log('👤 Name:', admin.name);
            console.log('🆔 ID:', admin._id);
        }

        await mongoose.connection.close();
        console.log('✅ Connection closed');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

initializeAdmin();
