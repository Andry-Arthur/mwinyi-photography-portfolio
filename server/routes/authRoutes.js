//// filepath: c:\Gettysburg College\Personal Projects\Salmin_Photo_WebApp\mwinyi-photography-portfolio\server\routes\authRoutes.js
const express = require('express');
const { initiateGoogleAuth, handleGoogleCallback } = require('../controllers/bookingController');
const router = express.Router();

// Route to start Google OAuth flow: GET /api/auth/google
router.get('/google', initiateGoogleAuth);

// Route for the Google callback: GET /api/auth/google/callback
router.get('/google/callback', handleGoogleCallback);

module.exports = router;