import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/reducer/authReducer'; 
import bcrypt from "bcryptjs";
import { useUser } from '../component/UserContext';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';

const apiBaseURL = 'https://hf6svendeapi-d5ebbcchbdcwcybq.northeurope-01.azurewebsites.net/api';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError("Email and password are required.");
      return;
    }
  
    try {
      const response = await axios.get(`${apiBaseURL}/Login/${email}`);
  
      const user = response.data;
  
      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          // Passwords match, login successful
          // Save login data to context
          console.log("Login Successfully");
          const userData = { email: user.email, isLoggedIn: true, userRole: user.role };
          setUserRole(user.role);
          setLoggedIn(true); // Update login status
          setEmail(user.email);
          console.log("Role: " + userData.userRole);
          dispatch(login(userData)); // Dispatch the login action with user data
          // Redirect to home page
          navigate("/", { state: { userData } });
          onClose();
        } else {
          // Passwords do not match, login failed
          setLoginError("Invalid email or password");
          console.log("Login Failed");
        }
        const userData = { 
          email: user.email, 
          id: user.id, 
          isLoggedIn: true 
        };
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        setLoginError(`Server responded with: ${error.response.data}`);
      } else if (error.request) {
        setLoginError('No response received from server');
      } else {
        setLoginError('Error setting up the request');
      }
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setLoginError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <button className="close-button" onClick={handleClose}>×</button>
        <h2>Login</h2>
        {loginError && <div className="error-message">{loginError}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={loginError ? 'error' : ''}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={loginError ? 'error' : ''}
        />
        <button
          className="login-button"
          onClick={handleLogin}
        >
          Login
        </button>
        <p>
          Don't have an account?{' '}
          <button
            type="button"
            className="link-button"
            onClick={(e) => {
              e.preventDefault();
              onClose(); 
            }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
