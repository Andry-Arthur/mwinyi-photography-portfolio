# Photography Portfolio & Booking Website

## Description

This project is a modern, full-stack web application built for [Photographer's Name or Business Name - **REPLACE THIS**] to showcase their photography portfolio. It allows potential clients to view galleries, inquire directly via a contact form, and book sessions through an integrated system linked to Google Calendar.

Built with the MERN stack (MongoDB, Express.js, React, Node.js) utilizing Vite for the frontend build tool.

## Features

* **Dynamic Photo Gallery:** Displays photographs fetched from a database, potentially categorized. (Image hosting via Cloudinary/S3 recommended).
* **Contact Form:** Allows users to send messages directly to the photographer's email inbox.
* **Booking System:** Enables users to request booking slots, which automatically creates an event on the photographer's Google Calendar upon confirmation/processing.

## Tech Stack

* **Frontend:** React (with Vite), React Router, Axios (or Fetch API)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose)
* **API Integrations:**
    * Google Calendar API (for bookings)
    * Nodemailer + Email Service (e.g., SendGrid, Mailgun - for contact form)
* **Image Handling:** Cloud Storage (e.g., Cloudinary, AWS S3 - URLs stored in DB)

## Project Structure

This project uses a monorepo structure containing the `client/` (Vite + React frontend) and `server/` (Node.js + Express backend) directories.

## License

This project is proprietary software. Usage, reproduction, and distribution are restricted according to the terms specified in the [LICENSE.md](LICENSE.md) file. All rights reserved.

## Authors

* Andry Rakotonjanabelo
* Salmin Mwinjuma