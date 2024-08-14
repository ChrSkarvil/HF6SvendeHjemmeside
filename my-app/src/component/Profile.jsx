import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../css/profile.css';

const ProfilePage = () => {
  // Hardcoded user data for display purposes
  const user = useSelector((state) => state.auth.user) || {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    address: '123 Main St',
    number: '123-456-7890',
    profilePicture: './assets/default.jpg',
  };

  // State for managing user inputs
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [number, setNumber] = useState(user.number);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    console.log('Profile updated:', { firstname, lastname, email, address, number, profilePicture });
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Demmacs Watches</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/watches">Watches</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            {user ? (
              <>
                <li>
                  <button className="logout-button" onClick={() => alert('Logout')}>Logout</button>
                </li>
                <li className="profile-info">
                  <img src={user.profilePicture} alt="Profile" className="profile-picture" />
                  <span style={{ marginRight: '20px', fontSize: '13px' }}>{user.firstname}</span>
                </li>
              </>
            ) : (
              <li>
                <button className="login-button" onClick={() => alert('Login')}>Login</button>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <div className="profile-container">
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
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <button type="submit" className="save-button">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
