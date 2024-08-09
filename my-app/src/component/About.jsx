import React from 'react';
import {useLocation} from 'react-router-dom';

const About = () => {
  const location = useLocation();
  return (
    <div>
      <h1>About Us</h1>
      <p>Learn more about our company.</p>
    </div>
  );
};

export default About;
