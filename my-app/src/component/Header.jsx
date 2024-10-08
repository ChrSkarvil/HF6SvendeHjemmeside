import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/action/authActions'; 
import { FaUser } from 'react-icons/fa';
import { CiLogin } from 'react-icons/ci'; 
import "../css/home.css";

const Header = ({ toggleModal }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const userRole = useSelector(state => state.auth.userRole);
  const fullName = useSelector(state => state.auth.fullName);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    window.location.href = '/'; 
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="App-header">
      <a href='/' style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1>Demmacs Watches</h1>
      </a>
      <div className="burger-menu" onClick={toggleMenu}>
        ☰  
      </div>
      <nav className={menuOpen ? 'active' : ''}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          {isLoggedIn ? (
            <li className='profile-container'>
              <div className='profile-placeholder' onClick={toggleDropdown}>
                <FaUser size={30} /> 
                <span className='welcome-message'> Welcome {fullName}</span>
              </div>
              {dropdownOpen && (
                <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
                  {isLoggedIn && userRole === 'Admin' && (
                    <Link to="/admin" className='dropdown-item' onClick={closeDropdown}>Admin Panel</Link>
                  )}
                  {isLoggedIn && userRole === 'Customer' && (
                    <Link to="/customerDashboard" className='dropdown-item' onClick={closeDropdown}>Listing & Profile</Link>
                  )}
                  <button className='dropdown-item button' onClick={() => { handleLogout(); closeDropdown(); }}>Logout</button>
                </div>
              )}
            </li>
          ) : (
            <li><button className='login-button icon-button' onClick={() => toggleModal('login')}><CiLogin /> Login</button></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
