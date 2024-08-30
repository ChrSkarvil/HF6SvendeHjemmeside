import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate  } from 'react-router-dom';
import { variables } from '../Variables';
import axiosInstance from '../services/axiosInstance';
import Footer from './Footer';
import { FaUser } from 'react-icons/fa';
import ProductGallery from './ProductGallery';
import '../css/customerDashboard.css';

function CustomerDashboard() {
  const { userId: userIdFromRedux } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [userId, setUserId] = useState(userIdFromRedux);
  const [error, setError] = useState(null);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get(`${variables.CUSTOMER_API_URL}/${userId}`);
      setUser(response.data);
    } catch (error) {
      setError('Error getting user profile');
      console.error('Error getting user profile:', error);
    }
  };

  // Fetch user listings
  const fetchUserListings = async () => {
    try {
      const response = await axiosInstance.get(`${variables.LISTING_API_URL}/customer/${userId}`);
      setListings(response.data);
    } catch (error) {
      setError('Error getting user listings');
      console.error('Error getting user listings:', error);
    }
  };

  useEffect(() => {
    if (!userId) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUserId(parsedUser.userId);
      }
    }
  }, [userId]);

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

  const handleSetStatus = async (id) => {
    try {
      await axiosInstance.put(
        `${variables.LISTING_API_URL}/${id}/true`
      );
      alert(`Sale ${id} approved!`);
    } catch (error) {
      console.error('Error approving sale:', error);
      alert('Failed to approve the sale. Please try again.');
    }
  };

  const handleEdit = async (id) => {
    const currentDateTime = new Date().toISOString();
    try {
      await axiosInstance.put(
        `${variables.LISTING_API_URL}/${id}/false/${currentDateTime}`
      );
      alert(`Sale ${id} denied!`);
    } catch (error) {
      console.error('Error approving sale:', error);
      alert('Failed to deny the sale. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;
    const currentDateTime = new Date().toISOString();
  
    try {
      await axiosInstance.put(`${variables.LISTING_API_URL}/delete/${id}/true/${currentDateTime}`);
      alert(`Listing ${id} deleted!`);
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete the listing. Please try again.');
    }
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
            showCustomerButtons={true}
            handleEdit={handleEdit}
            handleSetStatus={handleSetStatus}
            handleDelete={handleDelete}
          />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CustomerDashboard;
