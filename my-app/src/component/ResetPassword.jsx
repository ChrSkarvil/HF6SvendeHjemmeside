import React, { useState, useEffect } from 'react';
import '../css/resetPassword.css';

const ResetPassword = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setError('');
      setSuccessMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResetPassword = async () => {
    if (!email) {
      setError('Email is required.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setSuccessMessage('Password reset request sent. Please check your email for further instructions.');
      setError('');

      setEmail('');

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Reset Password Error:', error);
      setError('An error occurred. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();  
    onClose();
  };

  return (
    <div className="reset-password-overlay" onClick={handleClose}>
      <div className="reset-password" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>×</button>
        <h2>Reset Password</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message" style={{ color: 'green' }}>{successMessage}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={error ? 'error' : ''}
        />
        <button
          className="reset-button"
          onClick={handleResetPassword}
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
