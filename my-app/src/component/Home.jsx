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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    gender: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    color: '',
    brand: '',
  });

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const fetchProductsAndCustomers = async () => {
      try {
        const productResponse = await axios.get('https://hf6svendeapi-d5ebbcchbdcwcybq.northeurope-01.azurewebsites.net/api/Listing/verified');
        const customerResponse = await axios.get('https://hf6svendeapi-d5ebbcchbdcwcybq.northeurope-01.azurewebsites.net/api/Customer');

        setProducts(productResponse.data);
        setCustomers(customerResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductsAndCustomers();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = filters.gender ? product.gender === filters.gender : true;
    const matchesPrice = (filters.minPrice === '' || product.price >= filters.minPrice) &&
                          (filters.maxPrice === '' || product.price <= filters.maxPrice);
    const matchesSize = filters.size ? product.size === filters.size : true;
    const matchesColor = filters.color ? product.colors.includes(filters.color) : true;
    const matchesBrand = filters.brand ? product.brand === filters.brand : true;
    return matchesSearch && matchesGender && matchesPrice && matchesSize && matchesColor && matchesBrand;
  });

  const getCustomerFirstName = (customerId) => {
    const customer = customers.find(cust => cust.id === customerId);
    return customer ? customer.firstName : 'Unknown';
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="loading-message">Error: {error}</div>;

  return (
    <div className="App">
      <main className="App-content">
        <div className="search-filter-wrapper">
          <Category filters={filters} setFilters={setFilters} />
          <div className='search-container'>
            <input
              type="text"
              className="search-bar"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
