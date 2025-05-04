// server/routes/photoRoutes.js

// Import the Express framework
const express = require('express');

// Create an instance of the Express Router
const router = express.Router();

// Import the controller function(s) that handle photo-related requests
// Make sure the path to the controller file is correct
const { getPhotos } = require('../controllers/photoController');

// --- Define Routes ---

// Define a GET route for the base path ('/') of this router.
// When a GET request comes to '/api/photos' (as defined in server.js),
// this route will match the '/' part and execute the getPhotos controller function.
router.get('/', getPhotos);

/*
// --- Add more specific routes later ---

// Example: Route to get a single photo by its ID
// router.get('/:id', getPhotoById); // Requires a getPhotoById controller function

// Example: Route to add a new photo (requires authentication/protection later)
// router.post('/', protect, addPhoto); // Requires addPhoto controller and protect middleware

// Example: Route to delete a photo (requires authentication/protection later)
// router.delete('/:id', protect, deletePhoto); // Requires deletePhoto controller and protect middleware
*/

// Export the router so it can be used by the main application (server.js)
module.exports = router;
