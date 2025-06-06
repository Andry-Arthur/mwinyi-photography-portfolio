// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const photoRoutes = require('./routes/photoRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Load environment variables from .env file
dotenv.config();

// Create an Express application instance
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://photo-app-frontend-jobeb.ondigitalocean.app'
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// --- Define Routes ---
// Example Root Route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Photography Portfolio API!' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database status route for debugging
app.get('/api/debug/database', (req, res) => {
  const mongoose = require('mongoose');
  
  const dbStatus = {
    connection_state: mongoose.connection.readyState,
    connection_states: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    },
    has_mongodb_uri: !!process.env.MONGODB_URI,
    mongodb_uri_preview: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'Not set',
    database_name: mongoose.connection.name || 'Not connected',
    environment_check: {
      node_env: process.env.NODE_ENV || 'not set',
      has_cloudinary_cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
      has_cloudinary_api_key: !!process.env.CLOUDINARY_API_KEY,
      has_cloudinary_api_secret: !!process.env.CLOUDINARY_API_SECRET
    }
  };
  
  res.status(200).json(dbStatus);
});

// Admin route to import photos from Cloudinary
app.post('/api/admin/import-photos', async (req, res) => {
  try {
    const { importPhotos } = require('./utils/importCloudinaryPhotos');
    const result = await importPhotos();
    res.status(200).json({
      message: 'Photo import completed successfully',
      ...result
    });
  } catch (error) {
    console.error('Error importing photos:', error);
    res.status(500).json({
      message: 'Failed to import photos',
      error: error.message
    });
  }
});

// --- Mount API Routes ---
// Example Root Route
app.use('/api/photos', photoRoutes);        // Mount photo routes
app.use('/api/contact', contactRoutes);     // Mount contact routes
// --- End of API Routes ---

// --- Connect to Database (with error handling) ---
connectDB().catch(error => {
  console.error('[Database] Failed to connect to MongoDB, but server will continue running:', error.message);
});

// --- Define Port ---
const PORT = process.env.PORT || 5000;

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`[Server] Backend server is running on port ${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Server] CORS enabled for: ${corsOptions.origin}`);
});

// module.exports = app; // Optional: Uncomment for testing
