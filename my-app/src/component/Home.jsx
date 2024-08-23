import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Category from './Category';
import LoginModal from './LoginModal';
import '../css/home.css';
import Footer from './Footer';

function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sortOption, setSortOption] = useState('');

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  useEffect(() => {
    const fetchProductsAndCustomers = async () => {
      try {
        const productResponse = await axios.get('https://hf6svendeapi-d5ebbcchbdcwcybq.northeurope-01.azurewebsites.net/api/Listing/verified');
        const customerResponse = await axios.get('https://hf6svendeapi-d5ebbcchbdcwcybq.northeurope-01.azurewebsites.net/api/Customer');

        setProducts(productResponse.data);
        setCustomers(customerResponse.data);
      } catch (err) {
        console.error('API Error:', err.message);
      }
    };

    fetchProductsAndCustomers();
  }, []);

  const sortedProducts = () => {
    let sorted = [...products];

    if (sortOption === 'high-to-low') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'low-to-high') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'newest') {
      sorted.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
    }

    return sorted;
  };

  const filteredProducts = sortedProducts().filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getCustomerFirstName = (customerId) => {
    const customer = customers.find(cust => cust.id === customerId);
    return customer ? customer.firstName : 'Unknown';
  };

  return (
    <div className="App">
      <main className="App-content">
        <div className="search-filter-wrapper">
          <Category />
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
          <div className="sort-controls-container">
            <div className="sort-controls">
              <label>
                <input
                  type="radio"
                  name="sort"
                  value=""
                  checked={sortOption === ''}
                  onChange={handleSortChange}
                />
                <span>Nothing</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="high-to-low"
                  checked={sortOption === 'high-to-low'}
                  onChange={handleSortChange}
                />
                <span>Price: High - Low</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="low-to-high"
                  checked={sortOption === 'low-to-high'}
                  onChange={handleSortChange}
                />
                <span>Price: Low - High</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="newest"
                  checked={sortOption === 'newest'}
                  onChange={handleSortChange}
                />
                <span>Newest</span>
              </label>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 && searchQuery && (
          <div className="no-products">No products found</div>
        )}

        <div className="image-gallery">
          {filteredProducts.map(product => {
            const productDetails = product.product || {};
            const images = Array.isArray(productDetails.images) ? productDetails.images : [];
            const firstImage = images.length > 0 ? images[0] : null;
            const imageUrl = firstImage ? `data:image/jpeg;base64,${firstImage.fileBase64}` : './assets/default.jpg';
            
            const customerId = product.customerId;
            const customerFirstName = getCustomerFirstName(customerId);

            return (
              <Link to={`/product/${product.id}`} key={product.id} className="image-card-link">
                <div className="image-card">
                  <div className="customer-info">
                    <div className="profile-name">{customerFirstName}</div>
                  </div>
                  <img 
                    src={imageUrl}
                    alt={product.title || 'Product Image'} 
                    onError={(e) => e.target.src = './assets/default.jpg'}
                  />
                  <div className="image-info">
                    <div className="image-name">Name: {product.title || 'No Name'}</div>
                    <div className="image-price">Price: ${product.price || 'No Price'}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
      <LoginModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
}

export default Home;
