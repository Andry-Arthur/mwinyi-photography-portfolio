// server/utils/importCloudinaryPhotos.js

// Import necessary modules
const cloudinary = require('cloudinary').v2; // Use v2 for the latest API
const Photo = require('../models/Photo'); // Your Mongoose Photo model

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

// --- Main Import Function ---
const importPhotos = async () => {
  console.log('Starting photo import from Cloudinary...');
  
  // Initialize Cloudinary
  initializeCloudinary();
  
  console.log(`Fetching photos from Cloudinary folder: ${CLOUDINARY_FOLDER_NAME}...`);

  let allResources = [];
  let nextCursor = null;
  const MAX_RESULTS_PER_PAGE = 100; // Adjust based on Cloudinary limits/performance

  try {
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

        // Check if a photo with this URL already exists in the DB
        const existingPhoto = await Photo.findOne({ imageUrl: imageUrl });

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

          // Save the new document to MongoDB
          await newPhoto.save();
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
    throw error;
  }
};

// Export the function
module.exports = {
  importPhotos,
}; 