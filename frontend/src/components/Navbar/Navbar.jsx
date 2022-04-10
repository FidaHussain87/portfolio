import React from 'react';
import './navbar.css';
const Navbar = () => {
  return (
    <div className="nav-wrapper">
      <div className="nav-left">
        <div className="nav-logo">Fida</div>
        <span>Toggle</span>
      </div>
      <div className="nav-right">
        <div className="nav-list">
          <ul>
            <li>Home</li>
            <li>Services</li>
            <li>Experience</li>
            <li>Portfolio</li>
            <li>Testimonials</li>
          </ul>
        </div>
        <button className="button nav-button">
          Contact
        </button>
      </div>
    </div>
  )
}

export default Navbar
