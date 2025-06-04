// client/src/pages/BookingPage.jsx
import React from 'react';
import './BookingPage.css';

function BookingPage() {
  return (
    <div className="booking-page-container">
      <h1>Book a Session</h1>
      <p>Select your preferred service and date/time using our booking calendar below.</p>
      
      <div className="calendly-container">
        {/* Calendly inline widget embed */}
        <div 
          className="calendly-inline-widget" 
          data-url="https://calendly.com/mwinjumasalmin" 
          style={{ minWidth: '320px', height: '700px' }}
        ></div>
        <script 
          type="text/javascript" 
          src="https://assets.calendly.com/assets/external/widget.js" 
          async
        ></script>
      </div>
      
      <div className="booking-info">
        <h3>What to Expect</h3>
        <ul>
          <li>Choose from available time slots that work for your schedule</li>
          <li>You'll receive an automatic confirmation email with session details</li>
          <li>Feel free to include any special requests in the appointment notes</li>
          <li>If you need to reschedule, you can do so easily through the confirmation email</li>
        </ul>
        
        <h3>Session Types Available</h3>
        <div className="service-types">
          <div className="service-item">
            <h4>Portrait Session</h4>
            <p>Individual or family portraits in studio or outdoor locations</p>
          </div>
          <div className="service-item">
            <h4>Wedding Photography</h4>
            <p>Complete wedding day coverage or engagement sessions</p>
          </div>
          <div className="service-item">
            <h4>Event Coverage</h4>
            <p>Corporate events, parties, and special occasions</p>
          </div>
          <div className="service-item">
            <h4>Custom Sessions</h4>
            <p>Have something specific in mind? Let's discuss your vision</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;

