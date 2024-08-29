import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate  } from 'react-router-dom'; // Import Link for navigation
import { variables } from '../Variables';
import axiosInstance from '../services/axiosInstance';
import Footer from './Footer';
import { FaUser } from 'react-icons/fa';
import ProductGallery from './ProductGallery';
import '../css/customerDashboard.css';

function CustomerDashboard() {
  const { userId } = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get(`${variables.CUSTOMER_API_URL}/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Fetch user listings
  const fetchUserListings = async () => {
    try {
      const response = await axiosInstance.get(`${variables.LISTING_API_URL}/customer/${userId}`);
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching user listings:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserListings();
    }
  }, [userId]);

  const handleCreateListing = () => {
    navigate('/customerDashboard/listingCreate');
  };

  const handleEditProfile = () => {
    navigate('/customerDashboard/profile');
  };

  return (
    <div className="App">
      <main className="customer-dashboard-content">
        <div className="profile-section">
          <header className="profile-header">
          <FaUser size={40} />
            <div className="profile-details">
              <h1>{user?.fullName}</h1>
              <p>Email: {user?.email}</p>
              <p>Phone: {user?.phone || 'Not provided'}</p>
              <button className="edit-profile-btn" onClick={handleEditProfile}>Edit Profile</button>
              </div>
          </header>
        </div>

        <div className="listings-section">
          <div className="listings-header">
            <h2>My Listings</h2>
            <button className="create-listing-btn" onClick={handleCreateListing}>Create New Listing</button>
          </div>
          <div className="listings-grid">
          <ProductGallery
            products={listings}
            showButtons={false}
          />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CustomerDashboard;
