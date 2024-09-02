import React, { useState, useMemo } from 'react';
import { variables } from '../Variables';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useDispatch } from 'react-redux';
import { login } from '../redux/reducer/authReducer'; 
import { useNavigate } from 'react-router-dom';

const Register = ({ isOpen, onClose, toggleModal  }) => {
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      try {
        // Check if the email already exists
        const existingUserResponse = await axios.get(`${variables.LOGIN_API_URL}/${email}`);
  
        // If response is not 404 and there is data, user already exists
        if (existingUserResponse.data) {
          setErrors({ email: 'Email already exists' });
          return;
        }
  
      } catch (error) {
        if (error.response && error.response.status === 404) {
          try {
            const user = { 
              firstName: firstname, 
              lastName: lastname, 
              address, 
              phone: number,
              email, 
              postalCode,
              countryName: countryValue ? countryValue.label : 'Unknown',
            };
  
            const response = await axios.post(`${variables.CUSTOMER_API_URL}`, user);
            const customerId = response.data.id;
      
            if (customerId) {
              const loginData = { 
                email, 
                password: password,
                userType: 1, 
                isActive: true,
                customerId: customerId 
              };
      
              await axios.post(`${variables.LOGIN_API_URL}`, loginData);
  
              const loginResponse = await axios.post(`${variables.TOKEN_API_URL}/login`, { email, password });
              const { token, refreshToken, user } = loginResponse.data.authResponse;
  
              if (token && user && refreshToken) {
                const userId = user.customerId || user.employeeId;
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify({
                  email: user.email,
                  userRole: user.userRole,
                  userId: userId,
                }));
  
                dispatch(login({
                  email: user.email,
                  isLoggedIn: true,
                  userRole: user.role,
                  userId: userId,
                  token
                }));
  
                navigate("/", { state: { user } });
                onClose();
              } else {
                throw new Error('Login after registration failed');
              }
            } else {
              throw new Error('Failed to get customer ID.');
            }
          } catch (registrationError) {
            console.error('Registration error:', registrationError);
            setErrors({ general: 'Registration failed. Please try again.' });
          }
        } else {
          console.error('Error checking if email exists:', error);
          setErrors({ general: 'Registration failed. Please try again.' });
        }
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
              toggleModal('login'); 
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
