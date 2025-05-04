import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import BookingPage from './pages/BookingPage';
import ContactPage from './pages/ContactPage';
import Navbar from './components/Navbar';
import './App.css'; // Use this for general page layout styles if needed

function App() {
  return (
    <> {/* Use Fragment shorthand */}
      <Navbar />
      <main className="page-content"> {/* Optional wrapper for page content */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* You can add a 404 Not Found route later */}
          {/* <Route path="*" element={<h1>404 Not Found</h1>} /> */}
        </Routes>
      </main>
      {/* You could add a Footer component here later */}
    </>
  );
}

export default App;