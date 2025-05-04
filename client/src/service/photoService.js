// client/src/services/photoService.js

/**
 * Fetches all photos from the backend API.
 * Remember: During development, Vite's proxy handles redirecting '/api/photos'
 * to your backend server (e.g., http://localhost:5000/api/photos).
 * In production, you'll need to configure your server/hosting accordingly.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of photo objects.
 * @throws {Error} Throws an error if the network response is not ok.
 */
const getAllPhotos = async () => {
    try {
      // Make a GET request to the backend endpoint
      const response = await fetch('/api/photos'); // Relative path works due to Vite proxy
  
      // Check if the response status code is OK (200-299)
      if (!response.ok) {
        // If not OK, throw an error with the status text
        throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
      }
  
      // Parse the JSON response body
      const data = await response.json();
  
      // Return the array of photos
      return data;
  
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error fetching photos:", error);
      // Re-throw the error so the calling component can handle it
      throw error;
    }
  };
  
  // Export the function to be used in components
  export { getAllPhotos };
  