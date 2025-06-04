// server/controllers/photoController.js

const Photo = require('../models/Photo'); // Import the Photo model
const mongoose = require('mongoose'); // Import mongoose to handle potential ObjectId issues if needed

/**
 * @desc    Get a curated, randomized subset of photos (start, middle, end)
 * @route   GET /api/photos
 * @access  Public
 */
const getPhotos = async (req, res) => {
  const sampleSizePerSection = 10; // How many random photos to get from each section
  // Define how large a pool to sample from within each section.
  // Larger pool = more randomness but potentially slightly slower query.
  // Smaller pool = less random but faster. Must be >= sampleSizePerSection.
  const poolSizePerSection = 50;

  try {
    // Check if database is connected
    if (!mongoose.connection.readyState) {
      console.log('[Photos] Database not connected, returning empty array');
      return res.status(200).json([]); // Return empty array instead of object
    }

    // Get the total number of photos
    const totalCount = await Photo.countDocuments();

    // If total is too small for meaningful sections, sample from all
    if (totalCount < sampleSizePerSection * 3) {
      console.log(`Total photos (${totalCount}) is small, sampling from all.`);
      // Use $sample aggregation to get random documents up to the total count
      const randomSample = await Photo.aggregate([
        { $sample: { size: totalCount } } // Sample size capped at total docs
      ]);
      return res.status(200).json(randomSample);
    }

    // Calculate skip amounts for the start of the middle and end pools
    // Ensure middle pool starts after the first pool and doesn't overlap excessively
    const middlePoolSkip = Math.max(
        poolSizePerSection, // Start at least after the first pool
        Math.floor(totalCount / 2) - Math.floor(poolSizePerSection / 2) // Center the pool approx
    );
    // Ensure end pool starts correctly to capture the last 'poolSizePerSection' items
    const endPoolSkip = Math.max(0, totalCount - poolSizePerSection);

    console.log(`Total: ${totalCount}, Middle Pool Skip: ${middlePoolSkip}, End Pool Skip: ${endPoolSkip}`);

    // --- Aggregation Pipeline using $facet ---
    const aggregationResult = await Photo.aggregate([
      {
        $facet: {
          // --- Newest Photos Section ---
          newest: [
            { $sort: { createdAt: -1 } }, // Sort newest first
            { $limit: poolSizePerSection }, // Limit to the pool size for this section
            { $sample: { size: sampleSizePerSection } } // Randomly sample from the pool
          ],
          // --- Middle Photos Section ---
          middle: [
            { $sort: { createdAt: -1 } }, // Sort newest first (consistent order)
            { $skip: middlePoolSkip }, // Skip to the middle section
            { $limit: poolSizePerSection }, // Limit to the pool size
            { $sample: { size: sampleSizePerSection } } // Randomly sample from the pool
          ],
          // --- Oldest Photos Section ---
          oldest: [
            // To sample from the actual oldest, sort ascending first
            { $sort: { createdAt: 1 } }, // Sort oldest first
            { $limit: poolSizePerSection }, // Limit to the pool size (contains the oldest)
            { $sample: { size: sampleSizePerSection } } // Randomly sample from that oldest pool
            // Alternative if sorting descending:
            // { $sort: { createdAt: -1 } },
            // { $skip: endPoolSkip },
            // { $limit: poolSizePerSection },
            // { $sample: { size: sampleSizePerSection } }
          ]
        }
      }
    ]);

    // The result is an array containing one object with keys: newest, middle, oldest
    const results = aggregationResult[0];
    const newestPhotos = results.newest || [];
    const middlePhotos = results.middle || [];
    const oldestPhotos = results.oldest || [];

    // Combine the results and ensure uniqueness using a Map
    const combinedPhotosMap = new Map();

    // Add photos, ensuring newest version wins if there's an ID overlap (unlikely with sampling)
    newestPhotos.forEach(p => combinedPhotosMap.set(p._id.toString(), p));
    middlePhotos.forEach(p => combinedPhotosMap.set(p._id.toString(), p));
    oldestPhotos.forEach(p => combinedPhotosMap.set(p._id.toString(), p));

    // Convert the Map values back to an array
    const finalPhotos = Array.from(combinedPhotosMap.values());

    // Optional: Shuffle the final array for a completely random display order
    // finalPhotos.sort(() => Math.random() - 0.5);

    console.log(`Returning ${finalPhotos.length} randomized curated photos.`);
    res.status(200).json(finalPhotos); // Send the randomized curated photos

  } catch (error) {
    console.error(`Error fetching randomized curated photos: ${error.message}`);
    
    // Check if it's a database connection error
    if (error.message.includes('MONGODB_URI') || !mongoose.connection.readyState) {
      console.log('[Photos] Database connection error, returning empty array');
      return res.status(200).json([]); // Return empty array instead of object
    }
    
    res.status(500).json({ 
      message: 'Server Error: Could not fetch photos',
      error: error.message 
    });
  }
};

// Export the function
module.exports = {
  getPhotos,
};
