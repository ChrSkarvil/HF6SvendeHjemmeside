import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { variables } from '../Variables';
import '../css/profile.css';
import axiosInstance from '../services/axiosInstance';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import CustomPopup from './CustomPopup';

const Profile = () => {
  const { userId: userIdFromRedux } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(userIdFromRedux);
  const [popupMessage, setPopupMessage] = useState('');  

  // State for profile
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [countryValue, setCountryValue] = useState(null);
  const [loginId, setLoginId] = useState(null);

  // State for password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for form view
  const [view, setView] = useState('profile');

  // State for errors
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

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

  useEffect(() => {
    const fetchLogin = async () => {
      try {
        const response = await axiosInstance.get(`${variables.LOGIN_API_URL}/${email}`);
        const loginData = response.data;
        setLoginId(loginData.id);
      } catch (error) {
        console.error('Error fetching login data:', error);
      }
    };

    if (userId && email) {
      fetchLogin();
    }
  }, [userId, email]);

  useEffect(() => {
    if (!userId) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUserId(parsedUser.userId);
      }
    }
  }, [userId]);

  const validateProfileForm = () => {
    const newErrors = {};

    if (!firstname.trim()) {
      newErrors.firstname = 'First name is required.';
    }

    if (!lastname.trim()) {
      newErrors.lastname = 'Last name is required.';
    }

    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (address && !/^[A-Za-z0-9\s,.'-]{3,}$/.test(address)) {
      newErrors.address = 'Please enter a valid address.';
    }

    if (!number || !/^\d{7,15}$/.test(number)) {
      newErrors.number = 'Please enter a valid phone number.';
    }

    if (postalCode && !/^\d{4,10}$/.test(postalCode)) {
      newErrors.postalCode = 'Please enter a valid postal code.';
    }

    if (!countryValue) {
      newErrors.country = 'Please select a country.';
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required.';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters long.';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match.";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (validateProfileForm()) {
      try {
        await axiosInstance.put(
          `${variables.CUSTOMER_API_URL}/${userId}`,
          {
            firstName: firstname,
            lastName: lastname,
            email,
            address,
            phone: number,
            postalCode,
            countryName: countryValue?.label,
          }
        );
        setTimeout(() => {
          showPopup('Profile updated', false);
        }, 500); 
      } catch (error) {
        console.error('Error updating profile:', error);
        setTimeout(() => {
          showPopup('Failed to update profile. Please try again.',true);
        }, 500); 
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (validatePasswordForm()) {
      try {
        await axiosInstance.put(
          `${variables.LOGIN_API_URL}/${loginId}`,
          {
            email,
            currentPassword,
            newPassword,
            isActive: true
          }
        );
        showPopup('Password changed successfully', false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (error) {
        console.error('Error changing password:', error);
        showPopup('Failed to change password. Please try again.',true);
      }
    }
  };

  const handlePhoneChange = (value, countryData) => {
    setNumber(value);
    setCountryValue(options.find(c => c.value === countryData.countryCode.toLowerCase()) || options[0]);
  };

  const handleCountryChange = (selectedOption) => {
    setCountryValue(selectedOption);
  };

  const showPopup = (message, error) => {
    setPopupMessage(message);
    setTimeout(() => {
        if(!error)navigate('/customerDashboard')
        setPopupMessage('');
    }, 3000); 
};

  return (
    <div className="profile-page-container">
      <div className="profile-content">
        <h2>Edit Profile</h2>
        <div className="form-switch">
          <button onClick={() => setView('profile')} className={view === 'profile' ? 'active' : ''}>Edit Profile</button>
          <button onClick={() => setView('password')} className={view === 'password' ? 'active' : ''}>Change Password</button>
        </div>
        <div className="profile-pic-section">
          <FaUser size={60} />
        </div>

        {view === 'profile' ? (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              {profileErrors.firstname && <p className="error">{profileErrors.firstname}</p>}
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
              {profileErrors.lastname && <p className="error">{profileErrors.lastname}</p>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {profileErrors.email && <p className="error">{profileErrors.email}</p>}
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {profileErrors.address && <p className="error">{profileErrors.address}</p>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <PhoneInput
                country={countryValue?.value || 'dk'}
                value={number}
                onChange={handlePhoneChange}
                inputClass="form-control"
              />
              {profileErrors.number && <p className="error">{profileErrors.number}</p>}
            </div>

            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
              {profileErrors.postalCode && <p className="error">{profileErrors.postalCode}</p>}
            </div>
            <div className="form-group">
              <label>Country</label>
              <Select
                options={options}
                value={countryValue}
                onChange={handleCountryChange}
                className="country-select"
              />
              {profileErrors.country && <p className="error">{profileErrors.country}</p>}
            </div>
            <button type="submit" className="save-button">Save Changes</button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChange} className="password-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              {passwordErrors.currentPassword && <p className="error">{passwordErrors.currentPassword}</p>}
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {passwordErrors.newPassword && <p className="error">{passwordErrors.newPassword}</p>}
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {passwordErrors.confirmPassword && <p className="error">{passwordErrors.confirmPassword}</p>}
            </div>
            <button type="submit" className="save-button">Change Password</button>
          </form>
        )}
      </div>
      <CustomPopup message={popupMessage} onClose={() => setPopupMessage('')} />
    </div>
  );
};

export default Profile;
