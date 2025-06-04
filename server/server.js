// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const photoRoutes = require('./routes/photoRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Load environment variables from .env file
dotenv.config();

// --- Connect to Database ---
connectDB();

// Create an Express application instance
const app = express();

// Explicit CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// --- Define Routes ---
// Example Root Route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Photography Portfolio API!' });
});

// --- Mount API Routes ---
// Example Root Route
app.use('/api/photos', photoRoutes);        // Mount photo routes
app.use('/api/contact', contactRoutes);     // Mount contact routes
// --- End of API Routes ---

// --- Define Port ---
const PORT = process.env.PORT || 5000;

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`[Server] Backend server is running on port ${PORT}`);
});

// module.exports = app; // Optional: Uncomment for testing
