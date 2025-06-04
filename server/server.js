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

// Updated CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Development
    'https://photo-app-frontend-jobeb.ondigitalocean.app', // Your frontend URL
    'https://yourdomain.com' // Your custom domain (when you set it up)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
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
