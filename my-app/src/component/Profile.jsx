import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { variables } from '../Variables';
import '../css/profile.css';
import axiosInstance from '../services/axiosInstance';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import LoginModal from './LoginModal';

const Profile = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { userId } = useSelector((state) => state.auth);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryValue, setCountryValue] = useState(null);

  const options = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(`${variables.CUSTOMER_API_URL}/${userId}`);
        const userData = response.data;
        const phoneNumber = userData.phone ? userData.phone.toString() : '';
        setFirstname(userData.firstName);
        setLastname(userData.lastName);
        setEmail(userData.email);
        setAddress(userData.address);
        setNumber(phoneNumber);
        setPostalCode(userData.postalCode);
        setCountryValue(userData.countryName ? { label: userData.countryName, value: userData.countryCode } : options[0]);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, options]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    console.log('Profile updated:', { firstname, lastname, email, address, number, postalCode, countryValue });
  };

  const handlePhoneChange = (value, countryData) => {
    setNumber(value);
    setCountryValue(options.find(c => c.value === countryData.countryCode.toLowerCase()) || options[0]);
  };

  const handleCountryChange = (selectedOption) => {
    setCountryValue(selectedOption);
  };

  return (
    <div className="profile-page-container">
      <div className="profile-content">
        <h2>Edit Profile</h2>
        <form onSubmit={handleProfileUpdate} className="profile-form">
          <div className="profile-pic-section">
            <FaUser size={60} />
          </div>

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <PhoneInput
              country={countryValue?.value || 'dk'}
              value={number}
              onChange={handlePhoneChange}
              inputClass="form-control"
            />
          </div>

          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <Select
              options={options}
              value={countryValue}
              onChange={handleCountryChange}
              className="country-select"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="save-button">Save Changes</button>
        </form>
      </div>

      {isModalOpen && <LoginModal toggleModal={() => setModalOpen(false)} />}
    </div>
  );
};

export default Profile;
