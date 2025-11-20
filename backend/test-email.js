// Test email configuration
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('🔧 Testing email configuration...\n');
    
    console.log('📧 Email User:', process.env.EMAIL_USER);
    console.log('📧 Email Service:', process.env.EMAIL_SERVICE);
    console.log('📧 Password Set:', process.env.EMAIL_PASSWORD ? 'Yes' : 'No');
    console.log('📧 Password Length:', process.env.EMAIL_PASSWORD?.length || 0);
    console.log('');

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        console.log('✅ Transporter created');
        console.log('🔍 Verifying connection...\n');

        // Verify connection
        await transporter.verify();
        console.log('✅ Email server connection verified!\n');

        // Send test email
        console.log('📤 Sending test email...');
        const info = await transporter.sendMail({
            from: `"FarmerFriend Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self for testing
            subject: 'Test Email - FarmerFriend',
            html: '<h1>Test Email</h1><p>If you receive this, email configuration is working!</p>'
        });

        console.log('✅ Test email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        console.log('📧 Response:', info.response);
        console.log('\n✅ Email configuration is working correctly!');
        
    } catch (error) {
        console.error('\n❌ Email test failed!');
        console.error('❌ Error:', error.message);
        
        if (error.code === 'EAUTH') {
            console.error('\n💡 Authentication failed. Please check:');
            console.error('   1. Email address is correct');
            console.error('   2. App Password is correct (not regular password)');
            console.error('   3. 2-Factor Authentication is enabled on Gmail');
            console.error('   4. App Password has no spaces');
        }
    }
}

testEmail();
