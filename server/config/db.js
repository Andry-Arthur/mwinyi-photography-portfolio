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
      console.error('Error: MONGODB_URI is not defined in .env file');
      process.exit(1); // Exit process with failure
    }

    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(mongoURI); // Removed deprecated options

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;