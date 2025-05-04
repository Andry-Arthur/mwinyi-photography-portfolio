// server/models/Photo.js
const mongoose = require('mongoose');

// --- This is the Schema Definition ---
const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  category: {
    type: String,
    trim: true,
    default: 'Uncategorized'
  },
  order: {
    type: Number,
    default: 0
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// --- THIS LINE CREATES AND EXPORTS THE MODEL ---
// Mongoose uses 'Photo' (singular, capitalized) and looks for the
// 'photos' (plural, lowercase) collection in MongoDB.
module.exports = mongoose.model('Photo', photoSchema); // <--- Right here!