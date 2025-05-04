// server/controllers/photoController.js

// Import the Mongoose model you defined earlier
const Photo = require('../models/Photo');

/**
 * @desc    Get all photos from the database
 * @route   GET /api/photos
 * @access  Public (anyone can view photos)
 */
const getPhotos = async (req, res) => {
  try {
    // Use the Photo model to find all documents in the 'photos' collection.
    // .find({}) fetches all documents.
    // .sort({ createdAt: -1 }) sorts them by the 'createdAt' timestamp
    // in descending order (newest first). Mongoose adds createdAt/updatedAt
    // automatically if you have { timestamps: true } in your schema options.
    // If you don't have timestamps, you could sort by 'uploadDate' or 'order'.
    const photos = await Photo.find({}).sort({ createdAt: -1 });

    // Send a success response (status 200) with the fetched photos as JSON data.
    res.status(200).json(photos);

  } catch (error) {
    // If an error occurs during the database query or processing...
    console.error(`Error fetching photos: ${error.message}`); // Log the error for debugging

    // Send an error response back to the client.
    res.status(500).json({ message: 'Server Error: Could not fetch photos' });
  }
};


// --- Add more controller functions below later ---
/*
// Example placeholder for adding a photo
const addPhoto = async (req, res) => {
  // Logic to create a new photo document will go here
  res.status(201).json({ message: 'Photo added (placeholder)' });
};

// Example placeholder for deleting a photo
const deletePhoto = async (req, res) => {
  // Logic to delete a photo by ID will go here
  res.status(200).json({ message: 'Photo deleted (placeholder)' });
};
*/


// Export the function(s) so they can be used by the router
module.exports = {
  getPhotos,
  // addPhoto,    // Uncomment when you implement addPhoto
  // deletePhoto, // Uncomment when you implement deletePhoto
};