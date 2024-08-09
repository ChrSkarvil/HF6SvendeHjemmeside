import React from 'react';
import {useLocation} from 'react-router-dom';




const Watches = () => {
  const location = useLocation();
  return (
    <div>
      <h1>Watches Page</h1>
      <p>Explore our collection of watches.</p>
    </div>
  );
};

export default Watches;
