import React from 'react';
import {useLocation} from 'react-router-dom';
import { Link } from 'react-router-dom';

const Contact = () => {
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
        </ul>
      </nav>
    </header>
    <div>
      <h1>Contact Us</h1>
      <p>Get in touch with us.</p>
    </div>
    </div>
  );
};

export default Contact;
