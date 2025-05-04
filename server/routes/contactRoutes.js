// server/routes/contactRoutes.js

// Import the Express framework
const express = require('express');

// Create an instance of the Express Router
const router = express.Router();

// Import the controller function that handles sending the contact message
// Make sure the path to the controller file is correct
const { sendContactMessage } = require('../controllers/contactController');

// --- Define Routes ---

// Define a POST route for the base path ('/') of this router.
// When a POST request comes to '/api/contact' (as defined in server.js),
// this route will match the '/' part and execute the sendContactMessage controller function.
router.post('/', sendContactMessage);

// Export the router so it can be used by the main application (server.js)
module.exports = router;
