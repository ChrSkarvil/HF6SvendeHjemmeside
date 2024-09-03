import React, { useState, useEffect } from 'react';
import '../css/CustomPopup.css';

const CustomPopup = ({ message, onClose }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (message) {

      setIsFadingOut(false);
    } else {

      setIsFadingOut(true);
      setTimeout(() => {
        onClose();
      }, 500); 
    }
  }, [message, onClose]);

  useEffect(() => {
    if (message) {

      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          onClose();
        }, 500); 
      }, 3000);
      return () => clearTimeout(timer); 
    }
  }, [message, onClose]);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsFadingOut(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  if (!message && !isFadingOut) return null;

  return (
    <div className={`custom-popup-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      <div className={`custom-popup ${isFadingOut ? 'fade-out' : 'slide-in'}`}>
        <button className="close-button" onClick={handleClose}>×</button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default CustomPopup;
