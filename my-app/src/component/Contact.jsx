import React from 'react';
import {useLocation} from 'react-router-dom';

const Contact = () => {
  const location = useLocation();
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Get in touch with us.</p>
    </div>
  );
};

export default Contact;
