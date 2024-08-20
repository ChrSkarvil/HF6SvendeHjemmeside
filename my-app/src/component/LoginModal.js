import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '../redux/action/authActions';
import '../css/login.css';
import { useUser } from '../component/UserContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';

const apiBaseURL = 'https://hf6svendeapi-d5ebbcchbdcwcybq.northeurope-01.azurewebsites.net/api';

const LoginModal = ({ isOpen, onClose }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [countryValue, setCountryValue] = useState(null); // Default to null

  const dispatch = useDispatch();
  const { login } = useUser();

  const options = useMemo(() => countryList().getData(), []);
  const defaultCountry = options.find(option => option.value === 'dk') || options[0];

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z]+$/;
    const numberRegex = /^[0-9]+$/;

    if (!firstname || !nameRegex.test(firstname)) newErrors.firstname = 'Invalid first name';
    if (!lastname || !nameRegex.test(lastname)) newErrors.lastname = 'Invalid last name';
    if (!address) newErrors.address = 'Address is required';
    if (!number) newErrors.number = 'Phone number is required';
    if (!postalCode || !numberRegex.test(postalCode)) newErrors.postalCode = 'Invalid postal code';
    if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) newErrors.email = 'Invalid email';
    if (!password) newErrors.password = 'Password is required';
    if (isRegistering && password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      const user = { 
        email, 
        profilePicture: './assets/default.jpg',
        firstname, 
        lastname, 
        address, 
        number,
        postalCode,
        country: countryValue ? countryValue.label : 'Unknown'
      };
      
      try {
        const response = await axios.post(`${apiBaseURL}/Customer`, user);
        login(response.data);
        dispatch(loginSuccess(response.data));
        onClose();
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  const handleLogin = async () => {
    const credentials = { email, password };

    try {
      const response = await axios.post(`${apiBaseURL}/Login`, credentials);
      const user = response.data;

      if (user.UserType === 'Admin') {
        // Handle admin login
        dispatch(loginSuccess(user));
        onClose();
      } else if (user.UserType === 'Customer') {
        // Handle customer login
        const customerResponse = await axios.get(`${apiBaseURL}/Customer/${user.CustomerId}`);
        const customer = customerResponse.data;
        login(customer);
        dispatch(loginSuccess(customer));
        onClose();
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handlePhoneChange = (value, countryData) => {
    const countryCode = countryData?.countryCode || 'dk';
    setNumber(value);
    setCountryValue(
      options.find(c => c.value === countryCode.toLowerCase()) || defaultCountry
    );
  };

  const handleCountryChange = (selectedOption) => {
    setCountryValue(selectedOption);
  };

  const handleClose = () => {
    setFirstname('');
    setLastname('');
    setAddress('');
    setNumber('');
    setPostalCode('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    setIsRegistering(false); // Reset registration state
    setCountryValue(defaultCountry); // Reset country to default
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <button className="close-button" onClick={handleClose}>×</button>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        {isRegistering ? (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className={errors.firstname ? 'error' : ''}
            />
            {errors.firstname && <div className="error-message">{errors.firstname}</div>}
            
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className={errors.lastname ? 'error' : ''}
            />
            {errors.lastname && <div className="error-message">{errors.lastname}</div>}
            
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={errors.address ? 'error' : ''}
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
            
            <PhoneInput
              country={countryValue ? countryValue.value : 'dk'}
              value={number}
              onChange={handlePhoneChange}
              inputClass={errors.number ? 'error' : ''}
              containerClass="phone-input-container"
            />
            {errors.number && <div className="error-message">{errors.number}</div>}
            
            <input
              type="text"
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className={errors.postalCode ? 'error' : ''}
            />
            {errors.postalCode && <div className="error-message">{errors.postalCode}</div>}
            
            <Select
              options={options}
              value={countryValue}
              onChange={handleCountryChange}
              className="country-select"
              placeholder="Select Country"
            />
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
            
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}
        <button
          className="login-button"
          onClick={isRegistering ? handleRegister : handleLogin}
        >
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <p>
          {isRegistering ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsRegistering(false);
                }}
              >
                Login
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsRegistering(true);
                }}
              >
                Register
              </button>
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
