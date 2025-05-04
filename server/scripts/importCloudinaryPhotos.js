// server/scripts/importCloudinaryPhotos.js

// Import necessary modules
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2; // Use v2 for the latest API
const connectDB = require('../config/db'); // Your database connection function
const Photo = require('../models/Photo'); // Your Mongoose Photo model

// Load environment variables from .env file located in the parent directory (server/)
dotenv.config({ path: '../.env' }); // Adjust path if your script is run differently

// --- Configuration ---
const CLOUDINARY_FOLDER_NAME = 'Salmin-Photos'; // The exact name of the folder in Cloudinary

// --- Cloudinary Setup ---
// Configure Cloudinary using environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Error: Cloudinary environment variables (CLOUD_NAME, API_KEY, API_SECRET) are missing in .env file.');
  process.exit(1);
}
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Use https URLs
});

// --- Main Import Function ---
const importPhotos = async () => {
  console.log('Connecting to MongoDB...');
  await connectDB(); // Establish database connection
  console.log('MongoDB connected.');

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
      console.log('No photos found in the specified Cloudinary folder. Exiting.');
      return; // Exit if no photos found
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
          // console.log(`Skipping existing photo: ${imageUrl}`);
          skippedCount++;
        } else {
          // Create a new Photo document
          const newPhoto = new Photo({
            imageUrl: imageUrl,
            title: titleFromName || 'Untitled Photo', // Use extracted title or default
            description: resource.context?.custom?.caption || '', // Example: Use caption from context if available
            category: resource.folder || 'Uncategorized', // Use folder name as category or default
            // Add other fields based on Cloudinary metadata if desired
            // e.g., uploadDate: resource.created_at
          });

          // Save the new document to MongoDB
          await newPhoto.save();
          // console.log(`Imported photo: ${imageUrl}`);
          importedCount++;
        }
      }
    }

    console.log('------------------------------------');
    console.log('Import process finished.');
    console.log(`Successfully imported: ${importedCount} new photos.`);
    console.log(`Skipped existing: ${skippedCount} photos.`);
    console.log(`Total processed: ${allResources.length} Cloudinary resources.`);
    console.log('------------------------------------');

  } catch (error) {
    console.error('Error during import process:', error);
  } finally {
    // Close the MongoDB connection when done (optional, depends on your connectDB setup)
    // await mongoose.connection.close();
    // console.log('MongoDB connection closed.');
  }
};

// --- Run the Import ---
importPhotos(); // Execute the main function
