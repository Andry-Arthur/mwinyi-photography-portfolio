import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // We'll create this CSS file next
import logo from '../img/logo.svg'

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand"><img src={logo} alt="Mwinyi Clicks Logo" className="nav-logo" /></Link> {/* Optional Brand Name */}
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