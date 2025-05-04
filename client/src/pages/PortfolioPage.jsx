// client/src/pages/PortfolioPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllPhotos } from '../services/photoService'; // Import the API service function
import './PortfolioPage.css'; // We'll create this CSS file for styling
// Optional: Import a Flickr icon if using an icon library
// import { FlickrIcon } from 'lucide-react'; // Example if using lucide-react

function PortfolioPage() {
  // State variables
  const [photos, setPhotos] = useState([]); // To store the array of photos
  const [isLoading, setIsLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To store any error messages

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // Define an async function inside useEffect to fetch photos
    const fetchPhotos = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching
        setError(null); // Clear any previous errors
        const data = await getAllPhotos(); // Call the service function
        setPhotos(data); // Update state with the fetched photos
      } catch (err) {
        // If an error occurs during fetch, update the error state
        setError(err.message || 'Failed to fetch photos. Please try again later.');
        console.error("PortfolioPage fetch error:", err); // Log the error
      } finally {
        // This block runs regardless of success or failure
        setIsLoading(false); // Set loading to false once fetch attempt is complete
      }
    };

    fetchPhotos(); // Call the async function

    // The empty dependency array [] means this effect runs only once when the component mounts
  }, []);

  // --- Render Logic ---

  // Display loading indicator while fetching
  if (isLoading) {
    return (
      <div>
        <h1>Portfolio</h1>
        <p>Loading photos...</p>
      </div>
    );
  }

  // Display error message if fetching failed
  if (error) {
    return (
      <div>
        <h1>Portfolio</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  // Display the photos if loading is complete and no error occurred
  return (
    <div>
      <h1>Portfolio</h1>

      {/* --- ADD FLICKR LINK HERE --- */}
      <p className="flickr-link" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
         {/* Optional: <FlickrIcon size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> */}
        Explore the full collection on{' '}
        <a href="https://flickr.com/photos/mwinyiclicks/" target="_blank" rel="noopener noreferrer">
          Flickr
        </a>.
      </p>
      {/* --- END OF FLICKR LINK --- */}


      {photos.length === 0 ? (
        <p>No photos found.</p> /* Message if the array is empty */
      ) : (
        <div className="photo-gallery">
          {/* Map over the photos array and render an image for each */}
          {photos.map((photo) => (
            <div key={photo._id} className="photo-item"> {/* Use MongoDB _id as key */}
              <img
                src={photo.imageUrl}
                alt={photo.title || 'Portfolio image'} // Use title for alt text, fallback
                loading="lazy" // Add lazy loading for better performance
              />
              {/* You can optionally display title/description here too */}
              {/* <p>{photo.title}</p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PortfolioPage;
