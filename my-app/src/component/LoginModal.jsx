import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/reducer/authReducer'; 
import { useNavigate } from 'react-router-dom';
import { variables } from '../Variables';
import ResetPassword from './ResetPassword';
import '../css/login.css';

const LoginModal = ({ isOpen, onClose, toggleModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError("Email and password are required.");
      return;
    }
  
    try {
      const response = await axios.post(`${variables.TOKEN_API_URL}/login`, {
        email,
        password
      });
  
      const { token, refreshToken, user } = response.data.authResponse;

      if (token && user && refreshToken) {
        // Save token and user data to local storage
        const userId = user.customerId || user.employeeId;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify({
          email: user.email,
          userRole: user.userRole,
          userId: user.userId,
          fullName: user.fullName
        }));
        

        dispatch(login({
          email: user.email,
          isLoggedIn: true,
          userRole: user.role,
          userId: userId,
          fullName: user.fullName,
          token 
        }));

        console.log("Login Successfully");

        navigate("/", { state: { user } });
        onClose();
      } else {
        setLoginError("Invalid email or password");
        console.log("Login Failed");
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setLoginError("Invalid email or password");
        } else {
          setLoginError(`Server responded with: ${error.response.data.message || error.response.statusText}`);
        }
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

  const handleForgotPassword = () => {
    setIsResetPasswordOpen(true);
  };

  const closeResetPassword = () => {
    setIsResetPasswordOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
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
                toggleModal('register'); 
              }}
            >
              Register
            </button>
          </p>
          <p>
            <button
              type="button"
              className="link-button"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </p>
        </div>
      </div>

      <ResetPassword isOpen={isResetPasswordOpen} onClose={closeResetPassword} />
    </>
  );
};

export default LoginModal;
