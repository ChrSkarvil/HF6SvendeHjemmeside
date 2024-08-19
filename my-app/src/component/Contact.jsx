import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import '../css/contact.css';
import { useUser } from '../component/UserContext';


const Contact = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const { user, logout } = useUser();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate form submission
    console.log('Form submitted:', formData);

    // Show success message
    setStatus('Message sent successfully!');

    // Clear the form fields
    setFormData({ name: '', email: '', message: '' });
  };

  // const location = useLocation();
 
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
            {user ? (
              <>
                <li>
                  <button className='logout-button' onClick={logout}>Logout</button>
                </li>
                <li className='profile-info'>
                  <img src={user.profilePicture} alt="Profile" className='profile-picture' />
                  <span style={{ marginRight: '20px' }}> FirstName</span>
                  </li>
              </>
            ) : (
              <li><button className='login-button' onClick={toggleModal}>Login</button></li>
            )}
          </ul>
        </nav>
      </header>
      
      <div>
        <form onSubmit={handleSubmit} className="contact-form">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Send</button>
        </form>

        {status && <p className="status-message">{status}</p>}
      </div>

      <LoginModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default Contact;
