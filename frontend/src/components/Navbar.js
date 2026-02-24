import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { FiHome, FiPlus, FiBookmark, FiSettings } from 'react-icons/fi';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>🪑 Seat Booking System</h2>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">
            <FiHome /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/book" className="nav-link">
            <FiPlus /> Book Seat
          </Link>
        </li>
        <li>
          <Link to="/my-bookings" className="nav-link">
            <FiBookmark /> My Bookings
          </Link>
        </li>
        <li>
          <Link to="/admin" className="nav-link">
            <FiSettings /> Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
