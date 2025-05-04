// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Create an Express application instance
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing JSON request bodies

// --- Define Routes ---
// Example Root Route (you will add more routes later in separate files)
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Photography Portfolio API!' });
});

// TODO: Add routes for photos, bookings, contact later
// e.g., const photoRoutes = require('./routes/photoRoutes');
// app.use('/api/photos', photoRoutes);


// --- Define Port ---
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`[Server] Backend server is running on port ${PORT}`);
  // TODO: Add database connection logic here later
});