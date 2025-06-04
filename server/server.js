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
