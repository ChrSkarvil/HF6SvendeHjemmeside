import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/action/authActions';
import '../css/login.css';

const LoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  // Hardcoded credentials
  const hardcodedUser = {
    username: 'user',
    password: 'password',
  };

  const handleLogin = () => {
    // Reset error message
    setError('');

    // Check credentials against hardcoded values
    if (username === hardcodedUser.username && password === hardcodedUser.password) {
      dispatch(loginSuccess({ username }));
      onClose(); // Close the modal
    } else {
      setError('Username or password is incorrect');
    }
  };

  // Reset input fields and error message when closing the modal
  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <button className="close-button" onClick={handleClose}>×</button>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="error-message">{error}</div>}
        <button className="login-button" onClick={handleLogin}>Login</button>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
};

export default LoginModal;