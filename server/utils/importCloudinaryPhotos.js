// server/utils/importCloudinaryPhotos.js

// Import necessary modules
const cloudinary = require('cloudinary').v2; // Use v2 for the latest API
const Photo = require('../models/Photo'); // Your Mongoose Photo model
const mongoose = require('mongoose'); // Add mongoose import for connection checking

// --- Configuration ---
const CLOUDINARY_FOLDER_NAME = 'Salmin-Photos'; // The exact name of the folder in Cloudinary

// --- Cloudinary Setup ---
const initializeCloudinary = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing.');
  }
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Use https URLs
  });
};

// --- Database Connection Check ---
const checkDatabaseConnection = async () => {
  console.log('Checking database connection...');
  
  // Check if mongoose is connected
  if (mongoose.connection.readyState !== 1) {
    throw new Error(`Database not connected. Connection state: ${mongoose.connection.readyState}. Please ensure MONGODB_URI is set correctly.`);
  }
  
  // Test a simple database operation with shorter timeout
  try {
    await Photo.findOne().maxTimeMS(5000); // 5 second timeout
    console.log('Database connection verified successfully.');
  } catch (error) {
    if (error.message.includes('buffering timed out')) {
      throw new Error('Database connection timed out. Please check your MONGODB_URI and ensure the database is accessible.');
    }
    throw error;
  }
};

// --- Main Import Function ---
const importPhotos = async () => {
  console.log('Starting photo import from Cloudinary...');
  
  try {
    // Check database connection first
    await checkDatabaseConnection();
    
    // Initialize Cloudinary
    initializeCloudinary();
    
    console.log(`Fetching photos from Cloudinary folder: ${CLOUDINARY_FOLDER_NAME}...`);

    let allResources = [];
    let nextCursor = null;
    const MAX_RESULTS_PER_PAGE = 100; // Adjust based on Cloudinary limits/performance

    // Loop to handle pagination if there are many images
    do {
      const result = await cloudinary.search
        .expression(`folder:${CLOUDINARY_FOLDER_NAME}`) // Search within the specified folder
        .sort_by('public_id', 'asc') // Or 'created_at', 'updated_at'
        .max_results(MAX_RESULTS_PER_PAGE)
        .next_cursor(nextCursor) // Use cursor for pagination
        .execute();

      allResources = allResources.concat(result.resources);
      nextCursor = result.next_cursor; // Get cursor for the next page
      console.log(`Fetched ${result.resources.length} resources. Total fetched: ${allResources.length}. More pages: ${!!nextCursor}`);

    } while (nextCursor); // Continue if there's a next page

    console.log(`Found ${allResources.length} total photos in Cloudinary folder.`);

    if (allResources.length === 0) {
      console.log('No photos found in the specified Cloudinary folder.');
      return {
        totalFound: 0,
        imported: 0,
        skipped: 0,
        message: 'No photos found in Cloudinary folder'
      };
    }

    let importedCount = 0;
    let skippedCount = 0;

    // Process each resource found in Cloudinary
    for (const resource of allResources) {
      if (resource.resource_type === 'image') { // Ensure it's an image
        const imageUrl = resource.secure_url; // Get the secure HTTPS URL

        // Optional: Extract a title from the public_id (filename without extension)
        const titleFromName = resource.public_id.split('/').pop(); // Get filename part

        // Check if a photo with this URL already exists in the DB (with timeout)
        const existingPhoto = await Photo.findOne({ imageUrl: imageUrl }).maxTimeMS(5000);

        if (existingPhoto) {
          skippedCount++;
        } else {
          // Create a new Photo document
          const newPhoto = new Photo({
            imageUrl: imageUrl,
            title: titleFromName || 'Untitled Photo', // Use extracted title or default
            description: resource.context?.custom?.caption || '', // Example: Use caption from context if available
            category: resource.folder || 'Uncategorized', // Use folder name as category or default
            uploadDate: new Date(resource.created_at) // Use Cloudinary upload date
          });

          // Save the new document to MongoDB (with timeout)
          await newPhoto.save({ maxTimeMS: 5000 });
          importedCount++;
        }
      }
    }

    const result = {
      totalFound: allResources.length,
      imported: importedCount,
      skipped: skippedCount,
      message: `Successfully imported ${importedCount} new photos, skipped ${skippedCount} existing photos`
    };

    console.log('------------------------------------');
    console.log('Import process finished.');
    console.log(`Successfully imported: ${importedCount} new photos.`);
    console.log(`Skipped existing: ${skippedCount} photos.`);
    console.log(`Total processed: ${allResources.length} Cloudinary resources.`);
    console.log('------------------------------------');

    return result;

  } catch (error) {
    console.error('Error during import process:', error);
    
    // Provide more specific error messages
    if (error.message.includes('MONGODB_URI')) {
      throw new Error('Database configuration error: MONGODB_URI environment variable is not set or invalid.');
    } else if (error.message.includes('Cloudinary environment variables')) {
      throw new Error('Cloudinary configuration error: Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET environment variables.');
    } else if (error.message.includes('buffering timed out') || error.message.includes('connection timed out')) {
      throw new Error('Database connection timeout: Please check your MONGODB_URI and ensure the database is accessible from DigitalOcean.');
    }
    
    throw error;
  }
};

// Export the function
module.exports = {
  importPhotos,
}; 