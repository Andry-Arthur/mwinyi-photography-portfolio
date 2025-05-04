import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // We'll create this CSS file next

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">Mwinyi Clicks 📸</Link> {/* Optional Brand Name */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/portfolio">Portfolio</Link></li>
        <li><Link to="/booking">Booking</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;