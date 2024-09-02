import React, { useEffect } from 'react';
import '../css/notification.css';

function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);  
    return () => clearTimeout(timer); 
  }, [onClose]);

  return (
    <div className="notification">
      <p>{message}</p>
      <button onClick={onClose} className="close-btn">&times;</button>
    </div>
  );
}

export default Notification;
