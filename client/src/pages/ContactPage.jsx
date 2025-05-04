// client/src/pages/ContactPage.jsx
import React, { useState } from 'react';
import './ContactPage.css'; // We'll create this CSS file for styling
// --- Import only the existing icons ---
import { Instagram as InstagramIcon } from 'lucide-react'; // Removed FlickrIcon import

function ContactPage() {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // State for submission status
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear status message when user starts typing again
    setStatus({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });
  };

  // Handle server response after submission
  const handleServerResponse = (ok, msg) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: msg },
      });
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } else {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: msg },
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));

    try {
      // Send data to the backend API endpoint
      const res = await fetch('/api/contact', { // Relative path for Vite proxy
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const text = await res.text(); // Get response body as text first

      if (res.ok) {
        handleServerResponse(true, "Message sent successfully! We'll be in touch.");
      } else {
         // Try to parse error message if server sent JSON, otherwise use default
        let errorMsg = `Submission failed: ${res.statusText}`;
        try {
            const errorData = JSON.parse(text);
            errorMsg = errorData.message || errorMsg;
        } catch (parseError) {
            // If response wasn't JSON, use the text directly if available
            errorMsg = text || errorMsg;
        }
        handleServerResponse(false, errorMsg);
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      handleServerResponse(false, 'An unexpected error occurred. Please try again.');
    }
  };

  const instagramUrl = "https://www.instagram.com/salmin_mwinyi/";
  const flickrUrl = "https://flickr.com/photos/mwinyiclicks/";

  return (
    <div className="contact-page-container">
      <h1>Contact Me</h1>
      <p>Have a question or want to discuss a project? Fill out the form below.</p>

      {/* --- Social Links Section --- */}
      <div className="social-links-section">
         {/* --- Flickr link without icon --- */}
         <p className="social-link flickr-link">
           <a href={flickrUrl} target="_blank" rel="noopener noreferrer" className="social-link-anchor">
             {/* Removed FlickrIcon */}
             <span>Find more work on Flickr</span> {/* Keep text */}
           </a>
         </p>
         {/* --- Instagram link with icon --- */}
         <p className="social-link instagram-link">
           <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="social-link-anchor">
             <InstagramIcon size={18} className="social-icon" /> {/* Use Instagram icon */}
             <span>Follow me on Instagram (@salmin_mwinyi)</span> {/* Wrap text in span */}
           </a>
         </p>
      </div>
      {/* --- End Social Links Section --- */}


      <form onSubmit={handleSubmit} className="contact-form">
        {/* Form groups remain the same... */}
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={status.submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={status.submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            disabled={status.submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleInputChange}
            required
            disabled={status.submitting}
          ></textarea>
        </div>

        <button type="submit" disabled={status.submitting} className="submit-button">
          {status.submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {/* Display Submission Status */}
      {status.info.msg && (
        <p className={`status-message ${status.info.error ? 'error' : 'success'}`}>
          {status.info.msg}
        </p>
      )}
    </div>
  );
}

export default ContactPage;
