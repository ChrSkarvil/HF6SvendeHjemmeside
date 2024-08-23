import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/action/authActions'; 
import "../css/home.css";

const Header = ({ toggleModal }) => {
  const [menuOpen, setMenuOpen] = useState(false);  
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/'; 
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);  
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
          {user ? (
            <>
              <li>
                <button className='logout-button' onClick={handleLogout}>Logout</button>
              </li>
              <li className='profile-info'>
                <img src={user.profilePicture} alt="Profile" className='profile-picture' />
                <span style={{ marginRight: '20px', fontSize: '13px' }}>{user.FirstName}</span>
              </li>
            </>
          ) : (
            <li><button className='login-button' onClick={toggleModal}>Login</button></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
