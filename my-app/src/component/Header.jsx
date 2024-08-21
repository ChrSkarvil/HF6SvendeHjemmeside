import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/action/authActions'; 
import { FaUser } from 'react-icons/fa';
import "../css/home.css";

const Header = ({ toggleModal }) => {
  const [menuOpen, setMenuOpen] = useState(false); // State for menu toggle
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for the dropdown menu
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn); // Check if the user is logged in
  // const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/'; 
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the menu state
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle the dropdown menu state
  };

  return (
    <header className="App-header">
      <h1>Demmacs Watches</h1>
      <div className="burger-menu" onClick={toggleMenu}>
        ☰  
      </div>
      <nav className={menuOpen ? 'active' : ''}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/watches">Watches</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          {isLoggedIn ? (
            <li className='profile-container'>
              <div className='profile-placeholder' onClick={toggleDropdown}>
                <FaUser size={40} />
              </div>
              {dropdownOpen && (
                <div className='dropdown-menu'>
                  <Link to="/profile">Profile</Link>
                  <button className='logout-button' onClick={handleLogout}>Logout</button>
                </div>
              )}
            </li>
          ) : (
            <li><button className='login-button' onClick={toggleModal}>Login</button></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
