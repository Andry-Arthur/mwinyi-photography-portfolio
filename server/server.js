// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const photoRoutes = require('./routes/photoRoutes'); // <<< ADD THIS LINE: Import photo routes
const contactRoutes = require('./routes/contactRoutes'); // <<< ADD THIS LINE: Import contact routes

// Load environment variables from .env file
dotenv.config();

// --- Connect to Database ---
connectDB();

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

// --- Mount API Routes ---                 
app.use('/api/photos', photoRoutes);       
app.use('/api/contact', contactRoutes);
// TODO: Add routes for bookings, contact later
// e.g., const bookingRoutes = require('./routes/bookingRoutes');
// app.use('/api/bookings', bookingRoutes);
// e.g., const contactRoutes = require('./routes/contactRoutes');
// --- End of API Routes ---  


// --- Define Port ---
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`[Server] Backend server is running on port ${PORT}`);
  // The database connection attempt happens before the server starts listening.
  // The connectDB function logs success or failure itself.
});

// You might want to export 'app' if you plan on using it for testing with supertest
// module.exports = app; // Optional: Uncomment for testing
