import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import '../css/profile.css';
import { useUser } from '../component/UserContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import LoginModal from './LoginModal';

const Profile = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { user } = useUser(); // Removed logout as it is not used

  const reduxUser = useSelector((state) => state.auth.user) || {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    address: '123 Main St',
    number: '123-456-7890',
    profilePicture: './assets/default.jpg',
    postalCode: '12345',
    country: { label: 'Denmark', value: 'dk' },
  };

  const [firstname, setFirstname] = useState(user?.firstname || reduxUser.firstname);
  const [lastname, setLastname] = useState(user?.lastname || reduxUser.lastname);
  const [email, setEmail] = useState(user?.email || reduxUser.email);
  const [address, setAddress] = useState(user?.address || reduxUser.address);
  const [number, setNumber] = useState(user?.number || reduxUser.number);
  const [postalCode, setPostalCode] = useState(user?.postalCode || reduxUser.postalCode);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || reduxUser.profilePicture);
  const [countryValue, setCountryValue] = useState(reduxUser.country);

  const options = useMemo(() => countryList().getData(), []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    console.log('Profile updated:', { firstname, lastname, email, address, number, postalCode, countryValue, profilePicture });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePicture(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
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
            <img 
              src={profilePicture} 
              alt={`${firstname}'s profile`} 
              className="profile-pic" 
            />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePictureChange} 
              className="profile-pic-input"
            />
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
