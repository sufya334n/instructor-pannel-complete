

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Easlogo from '../assets/EASLogo.png';
const Navbar = ({ onLogout, instructorName, instructorId }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };
  return (
    <aside className="sidebar" style={{ display:'flex' }}>

      <div className="sidebar-logo" > 
        <img 
  src={Easlogo} 
  alt="Logo" 
  style={{ width: '140px', height: '140px' ,borderRadius: '5%' }} 
/>
Instructor Panel
</div>
      {instructorName && <div className="sidebar-instructor-name">WELCOME TO <strong>{instructorName}</strong></div>}
      <nav className="sidebar-links">
        <NavLink to="/courses" className={({ isActive }) => (isActive ? 'active' : '')}>
          Courses
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
          Profile
        </NavLink>
        <NavLink to="/instructor/pending-payments" className={({ isActive }) => (isActive ? 'active' : '')}>
          Pending Payments
        </NavLink>
        <NavLink to="/instructor/paid-payments" className={({ isActive }) => (isActive ? 'active' : '')}>
          Paid Payments
        </NavLink>

      </nav>
      <div className="sidebar-logout">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
};

export default Navbar;
