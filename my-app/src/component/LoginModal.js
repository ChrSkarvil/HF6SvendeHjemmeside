import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '../redux/action/authActions';
import '../css/login.css';
import { useUser } from '../component/UserContext';
import { useNavigate } from 'react-router-dom';

const apiBaseURL = 'https://hf6svendeapi-d5ebbcchbdcwcybq.northeurope-01.azurewebsites.net/api';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const dispatch = useDispatch();
  const { setUserRole, setLoggedIn } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError("Email and password are required.");
      return;
    }
  
    try {
      const response = await axios.post(`${apiBaseURL}/Login`, {
        email,
        password
      });
  
      if (response.status === 200) {
        const user = response.data;
        if (user) {
          console.log("Login Successful");
          const userData = { email: user.email, isLoggedIn: true, userRole: user.role };
          setUserRole(user.role);
          setLoggedIn(true);
          dispatch(loginSuccess(userData)); // Dispatch the login action with user data
  
          // Redirect to home page
          navigate("/", { state: { userData } });
        } else {
          setLoginError("User not found");
        }
      } else {
        setLoginError('Incorrect email or password');
      }
    } catch (error) {
      console.error("Error:", error);
      setLoginError('An error occurred. Please try again.');
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
              onClose(); // Assuming you want to switch to the Register component from here
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
