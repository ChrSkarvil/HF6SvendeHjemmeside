import React, { useState, useMemo } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';

const apiBaseURL = 'https://hf6svendeapi-d5ebbcchbdcwcybq.northeurope-01.azurewebsites.net/api';

const Register = ({ isOpen, onClose }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [countryValue, setCountryValue] = useState(null);

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
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { 
        email, 
        profilePicture: './assets/default.jpg',
        firstName: firstname, 
        lastName: lastname, 
        address, 
        phone: number,
        postalCode,
        country: countryValue ? countryValue.label : 'Unknown',
        password: hashedPassword
      };
      
      try {
        await axios.post(`${apiBaseURL}/Register`, user); // Assuming the correct endpoint for registration
        onClose(); // Close registration modal or redirect as needed
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({ general: 'Registration failed. Please try again.' });
      }
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
    setCountryValue(defaultCountry);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <button className="close-button" onClick={handleClose}>×</button>
        <h2>Register</h2>
        {errors.general && <div className="error-message">{errors.general}</div>}
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
        
        <button
          className="login-button"
          onClick={handleRegister}
        >
          Register
        </button>
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="link-button"
            onClick={(e) => {
              e.preventDefault();
              onClose(); // Assuming you want to switch to the Login component from here
            }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
