// server/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars (just to ensure MONGODB_URI is accessible if not loaded elsewhere early)
dotenv.config();

const connectDB = async () => {
  try {
    // Get MongoDB connection string from environment variables
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      const errorMsg = 'Error: MONGODB_URI is not defined in environment variables';
      console.error(`[Database] ${errorMsg}`);
      console.error('[Database] Please set MONGODB_URI in your DigitalOcean environment variables');
      throw new Error(errorMsg); // Throw error instead of exiting process
    }

    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(mongoURI); // Removed deprecated options

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Error connecting to MongoDB: ${error.message}`);
    throw error; // Throw error instead of exiting process
  }
};

module.exports = connectDB;