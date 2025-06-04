// client/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPhotos } from '../services/photoService'; // Import the photo service
import './HomePage.css';

// --- Icons (Optional, install lucide-react if using) ---
// import { Camera, Users, Calendar, Mail } from 'lucide-react';

function HomePage() {
  const [featuredPhotos, setFeaturedPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch a subset of photos on component mount
  useEffect(() => {
    const fetchFeaturedPhotos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allFetchedPhotos = await getAllPhotos(); // Fetches the random subset from backend
        // Take the first few photos from the fetched subset for the home page display
        setFeaturedPhotos(allFetchedPhotos.slice(0, 5)); // Display up to 5 photos
      } catch (err) {
        setError('Could not load featured photos.');
        console.error("HomePage fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPhotos();
  }, []);

  // Effect for cycling through featured photos
  useEffect(() => {
    if (featuredPhotos.length > 1) {
      const timer = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) =>
          (prevIndex + 1) % featuredPhotos.length
        );
      }, 5000); // Change image every 5 seconds

      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(timer);
    }
  }, [featuredPhotos]); // Re-run effect if featuredPhotos array changes


  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-headline">Capturing Moments, Creating Memories</h1>
          <p className="hero-tagline">
            Professional photography services by Salmin Mwinyi in Gettysburg, PA and surrounding areas. Specializing in Portraits, Events, and more.
          </p>
          <div className="hero-cta-buttons">
            <Link to="/portfolio" className="cta-button primary">View Portfolio</Link>
            <Link to="/booking" className="cta-button secondary">Book a Session</Link>
          </div>
        </div>
        {/* Background image is applied via CSS */}
      </section>

      {/* --- Featured Photos Section --- */}
      <section className="featured-photos-section">
        <h2>Featured Work</h2>
        <div className="featured-photos-container">
          {isLoading && <p>Loading images...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!isLoading && !error && featuredPhotos.length > 0 && (
            featuredPhotos.map((photo, index) => (
              <img
                key={photo._id}
                src={photo.imageUrl}
                alt={photo.title || 'Featured work'}
                // Apply 'active' class to the current image for fade effect
                className={`featured-photo ${index === currentPhotoIndex ? 'active' : ''}`}
                loading="lazy"
              />
            ))
          )}
           {!isLoading && !error && featuredPhotos.length === 0 && (
             <p>No featured photos available at the moment.</p>
           )}
        </div>
         <div className="view-all-cta">
             <Link to="/portfolio" className="cta-button-simple">View Full Portfolio</Link>
         </div>
      </section>
      {/* --- End Featured Photos Section --- */}


      {/* --- Services Overview Section --- */}
      <section className="services-overview">
        <h2>Services Offered</h2>
        <div className="services-grid">
          <div className="service-item">
             {/* Optional Icon: <Camera size={40} className="service-icon" /> */}
             <img src="https://placehold.co/60x60/007bff/ffffff?text=📸" alt="Portrait Icon" className="service-icon-img"/>
            <h3>Portrait Sessions</h3>
            <p>Individual, couple, and family portraits capturing your unique personality.</p>
          </div>
          <div className="service-item">
            {/* Optional Icon: <Users size={40} className="service-icon" /> */}
            <img src="https://placehold.co/60x60/28a745/ffffff?text=🎉" alt="Event Icon" className="service-icon-img"/>
            <h3>Event Photography</h3>
            <p>Coverage for parties, corporate events, gatherings, and special occasions.</p>
          </div>
          <div className="service-item">
            {/* Optional Icon: <Calendar size={40} className="service-icon" /> */}
             <img src="https://placehold.co/60x60/dc3545/ffffff?text=💍" alt="Wedding Icon" className="service-icon-img"/>
            <h3>Wedding & Engagement</h3>
            <p>Documenting your special day with care and creativity (inquire for packages).</p>
          </div>
           <div className="service-item">
            {/* Optional Icon: <Mail size={40} className="service-icon" /> */}
             <img src="https://placehold.co/60x60/ffc107/ffffff?text=✉️" alt="Contact Icon" className="service-icon-img"/>
            <h3>Custom Requests</h3>
            <p>Have something else in mind? Let's discuss your specific photography needs.</p>
          </div>
        </div>
         <div className="contact-cta">
             <Link to="/contact" className="cta-button-simple">Get in Touch</Link>
         </div>
      </section>
      {/* --- End Services Overview Section --- */}


      {/* --- About Brief Section --- */}
      <section className="about-brief">
        <h2>About Salmin Mwinyi</h2>
        <p>
          Based in Gettysburg, PA, Salmin Mwinyi combines technical skill with a creative eye to deliver stunning photographs.
          Passionate about capturing authentic moments and creating lasting memories for clients.
          {/* Add more details or maybe a link to a future dedicated 'About' page */}
        </p>
        {/* Optional: Add a small photo of the photographer */}
        {/* <img src="photographer_photo_url" alt="Salmin Mwinyi" className="photographer-photo"/> */}
      </section>
      {/* --- End About Brief Section --- */}

    </div>
  );
}

export default HomePage;
