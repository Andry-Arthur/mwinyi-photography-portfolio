// server/controllers/contactController.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load env vars if not already loaded
dotenv.config();

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail app password
    }
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter verification failed:', error);
    } else {
        console.log('Email transporter is ready to send emails');
    }
});

/**
 * @desc    Handle contact form submission and send email
 * @route   POST /api/contact
 * @access  Public
 */
const sendContactMessage = async (req, res) => {
    // Destructure form data from request body
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    // Prepare email content
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                New Contact Message from Portfolio
            </h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
            </div>
            <div style="margin: 20px 0;">
                <h3 style="color: #333;">Message:</h3>
                <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #007bff; border-radius: 3px;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
                This message was sent from your photography portfolio contact form.
            </p>
        </div>
    `;

    // Construct the email message object
    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to yourself
        replyTo: email, // Set reply-to as the sender's email
        subject: `Portfolio Contact: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`, // Plain text version
        html: htmlContent // HTML version
    };

    try {
        // Attempt to send the email using Nodemailer
        const info = await transporter.sendMail(mailOptions);
        console.log('Contact email sent successfully:', info.messageId);
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending contact email:', error);
        
        // More specific error handling
        if (error.code === 'EAUTH') {
            console.error('Email authentication failed. Check EMAIL_USER and EMAIL_PASS.');
        } else if (error.code === 'ENOTFOUND') {
            console.error('Network error. Check internet connection.');
        }
        
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
};

// Export the function
module.exports = {
    sendContactMessage,
};
