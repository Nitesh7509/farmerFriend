const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
    // For Gmail
    if (process.env.EMAIL_SERVICE === 'gmail') {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        return transporter;
    }
    
    // For other SMTP services
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    return transporter;
};

// Send password reset email
const sendPasswordResetEmail = async (userEmail, userName, resetToken) => {
    try {
        console.log('📧 Attempting to send password reset email to:', userEmail);
        console.log('📧 Using email service:', process.env.EMAIL_USER);
        
        const transporter = createTransporter();
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: `"FarmerFriend" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Password Reset Request - FarmerFriend 🔐',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                        .button { display: inline-block; background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
                        .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <p>Dear ${userName},</p>
                            <p>We received a request to reset your password for your FarmerFriend account.</p>
                            
                            <p>Click the button below to reset your password:</p>
                            
                            <center>
                                <a href="${resetLink}" class="button">Reset Password</a>
                            </center>
                            
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; color: #3b82f6;">${resetLink}</p>
                            
                            <div class="warning">
                                <strong>⚠️ Important:</strong>
                                <ul style="margin: 10px 0;">
                                    <li>This link will expire in 1 hour</li>
                                    <li>If you didn't request this, please ignore this email</li>
                                    <li>Your password won't change until you create a new one</li>
                                </ul>
                            </div>
                            
                            <p>If you have any questions, please contact our support team.</p>
                            
                            <p style="margin-top: 30px;">Best regards,<br>The FarmerFriend Team 🌱</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email from FarmerFriend.</p>
                            <p>© ${new Date().getFullYear()} FarmerFriend. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        console.log('📧 Response:', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email sending failed!');
        console.error('❌ Error:', error.message);
        console.error('❌ Full error:', error);
        return { success: false, error: error.message };
    }
};

// Send contact form email to owner
const sendContactEmail = async (senderName, senderEmail, subject, message) => {
    try {
        console.log('📧 Sending contact form message to owner');
        
        const transporter = createTransporter();
        const ownerEmail = process.env.OWNER_EMAIL || process.env.EMAIL_USER;

        const mailOptions = {
            from: `"FarmerFriend Contact" <${process.env.EMAIL_USER}>`,
            to: ownerEmail,
            replyTo: senderEmail,
            subject: `Contact Form: ${subject}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                        .info-box { background-color: white; padding: 15px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #16a34a; }
                        .message-box { background-color: white; padding: 20px; margin: 20px 0; border-radius: 6px; border: 1px solid #e5e7eb; }
                        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📬 New Contact Form Message</h1>
                        </div>
                        <div class="content">
                            <p><strong>You have received a new message from the FarmerFriend contact form.</strong></p>
                            
                            <div class="info-box">
                                <p><strong>From:</strong> ${senderName}</p>
                                <p><strong>Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></p>
                                <p><strong>Subject:</strong> ${subject}</p>
                                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                            </div>
                            
                            <div class="message-box">
                                <h3>Message:</h3>
                                <p style="white-space: pre-wrap;">${message}</p>
                            </div>
                            
                            <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                <strong>💡 Tip:</strong> You can reply directly to this email to respond to ${senderName}.
                            </p>
                        </div>
                        <div class="footer">
                            <p>This message was sent via FarmerFriend Contact Form</p>
                            <p>© ${new Date().getFullYear()} FarmerFriend. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Contact email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Contact email sending failed!');
        console.error('❌ Error:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendContactEmail
};
