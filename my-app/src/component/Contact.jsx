import React, { useState } from 'react';
import '../css/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');



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

  return (
    <div className="App">

      
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

    </div>
  );
};

export default Contact;
