import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginModal from './LoginModal';
import { variables } from '../Variables'
// import '../css/home.css';
import '../css/handleListings.css';
import Footer from './Footer';
import ProductGallery from './ProductGallery';

function HandleListings() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleApprove = (id) => {
    alert(`Sale ${id} approved!`);
  };

  const handleDeny = (id) => {
    alert(`Sale ${id} denied.`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get(`${variables.LISTING_API_URL}/unverified`);

        setProducts(productResponse.data);
      } catch (err) {
        console.error('API Error:', err.message);
      }
    };

    fetchProducts();
  }, []);


  const filteredProducts = products.filter(product => {
    const searchQueryLower = searchQuery.toLowerCase();

    const matchesTitle = product.title?.toLowerCase().includes(searchQueryLower);
    const matchesBrand = product.product.brand?.toLowerCase().includes(searchQueryLower);
    const matchesCustomer = product.customerName?.toLowerCase().includes(searchQueryLower);

    return matchesTitle || matchesBrand || matchesCustomer;
  });

  return (
    <div className="App">
      <main className="App-content">
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
            showButtons={true}
          />
        </div>
      </main>
      <Footer />
      <LoginModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
}

export default HandleListings;
