import React, { useState } from 'react';
import {useLocation} from 'react-router-dom';
import LoginModal from './LoginModal';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  const location = useLocation();
  return (
    <div className="App">
    <header className="App-header">
      <h1>Demmacs Watches</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/watches">Watches</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><button className='login-button' onClick={toggleModal}>Login</button></li>
          </ul>
      </nav>
    </header>
    <div>
      <h1>Contact Us</h1>
      <p>Get in touch with us.</p>
    </div>
    <LoginModal isOpen={isModalOpen} onClose={toggleModal} />

    </div>
  );
};

export default Contact;
