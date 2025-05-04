// server/controllers/contactController.js
const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

// Load env vars if not already loaded (good practice in controllers)
dotenv.config();

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Ensure required environment variables are set
if (!process.env.SENDER_EMAIL_ADDRESS || !process.env.RECIPIENT_EMAIL_ADDRESS || !process.env.SENDGRID_API_KEY) {
    console.error("FATAL ERROR: Email environment variables (SENDER_EMAIL_ADDRESS, RECIPIENT_EMAIL_ADDRESS, SENDGRID_API_KEY) are missing.");
    // Optionally exit or handle this more gracefully depending on application needs
    // process.exit(1);
}

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

    // Prepare email content
    const emailContent = `
        <h1>New Contact Message from Portfolio</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p> `;

    // Construct the email message object for SendGrid
    const msg = {
        to: process.env.RECIPIENT_EMAIL_ADDRESS, // Your friend's email address from .env
        from: process.env.SENDER_EMAIL_ADDRESS, // Your verified sender email address from .env
        subject: `Portfolio Contact: ${subject}`, // Prepend subject for clarity
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`, // Plain text version
        html: emailContent, // HTML version
        replyTo: email, // Set the reply-to field to the sender's email
    };

    try {
        // Attempt to send the email using SendGrid
        await sgMail.send(msg);
        console.log('Contact email sent successfully via SendGrid');
        res.status(200).json({ message: 'Message sent successfully!' }); // Send success response to frontend
    } catch (error) {
        console.error('Error sending contact email via SendGrid:', error);

        // Log more details if available (SendGrid often puts details in error.response.body)
        if (error.response) {
            console.error('SendGrid Error Body:', error.response.body);
        }

        // Send error response to frontend
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
};

// Export the function
module.exports = {
    sendContactMessage,
};
