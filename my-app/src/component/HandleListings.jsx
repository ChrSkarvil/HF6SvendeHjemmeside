import React, { useState, useEffect, useCallback  } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useLocation } from 'react-router-dom';
import { variables } from '../Variables'
// import '../css/home.css';
import '../css/handleListings.css';
import Footer from './Footer';
import ProductGallery from './ProductGallery';
import CustomPopup from './CustomPopup';

function HandleListings() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [popupMessage, setPopupMessage] = useState('');  

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const listingType = queryParams.get('type') || 'unverified';


  const fetchProducts = useCallback(async () => {
    let endpoint;
    switch (listingType) {
      case 'all':
        endpoint = `${variables.LISTING_API_URL}`;
        break;
      case 'denied':
        endpoint = `${variables.LISTING_API_URL}/denied`;
        break;
      case 'unverified':
      default:
        endpoint = `${variables.LISTING_API_URL}/unverified`;
        break;
    }

    try {
      const productResponse = await axiosInstance.get(endpoint);
      setProducts(productResponse.data);
    } catch (err) {
      console.error('API Error:', err.message);
    }
  }, [listingType]);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(
        `${variables.LISTING_API_URL}/${id}/true`
      );
      showPopup(`Sale ${id} approved!`);
      fetchProducts();
    } catch (error) {
      console.error('Error approving sale:', error);
      showPopup('Failed to approve the sale. Please try again.');
    }
  };

  const handleDeny = async (id) => {
    const currentDateTime = new Date().toISOString();
    try {
      await axiosInstance.put(
        `${variables.LISTING_API_URL}/${id}/false/${currentDateTime}`
      );
      showPopup(`Sale ${id} denied!`);
      fetchProducts();
    } catch (error) {
      console.error('Error approving sale:', error);
      showPopup('Failed to deny the sale. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;
    const currentDateTime = new Date().toISOString();
  
    try {
      await axiosInstance.put(`${variables.LISTING_API_URL}/delete/${id}/true/${currentDateTime}`);
      showPopup(`Listing ${id} deleted!`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting listing:', error);
      showPopup('Failed to delete the listing. Please try again.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => {
        setPopupMessage('');
    }, 3000); 
};



  const filteredProducts = products.filter(product => {
    const searchQueryLower = searchQuery.toLowerCase();

    const matchesTitle = product.title?.toLowerCase().includes(searchQueryLower);
    const matchesBrand = product.product.brand?.toLowerCase().includes(searchQueryLower);
    const matchesCustomer = product.customerName?.toLowerCase().includes(searchQueryLower);

    return matchesTitle || matchesBrand || matchesCustomer;
  });

  return (
    <div className="App">
      <main className="handle-listings-content">
        <div className="search-controls">
          <div className="search-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className='handle-listings'>
          <ProductGallery
            products={filteredProducts}
            handleApprove={handleApprove}
            handleDeny={handleDeny}
            handleDelete={handleDelete}
            listingType={listingType}
            showAdminButtons={true}
          />
        </div>
      </main>
      <Footer />
      <CustomPopup message={popupMessage} onClose={() => setPopupMessage('')} />
    </div>
  );
}

export default HandleListings;
