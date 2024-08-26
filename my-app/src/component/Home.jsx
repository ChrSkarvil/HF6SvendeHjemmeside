import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginModal from './LoginModal';
import '../css/home.css';
import Footer from './Footer';
import ProductGallery from './ProductGallery'

function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get('https://hf6svendeapi-d5ebbcchbdcwcybq.northeurope-01.azurewebsites.net/api/Listing/verified');

        setProducts(productResponse.data);
      } catch (err) {
        console.error('API Error:', err.message);
      }
    };

    fetchProducts();
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
    const searchQueryLower = searchQuery.toLowerCase();

    const matchesTitle = product.title?.toLowerCase().includes(searchQueryLower);
    const matchesBrand = product.product.brand?.toLowerCase().includes(searchQueryLower);
    const matchesCustomer = product.customerName?.toLowerCase().includes(searchQueryLower);
    return matchesTitle || matchesBrand || matchesCustomer;
  });

  return (
    <div className="App">
      <main className="App-content">
        <div className="search-filter-wrapper">
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

        <ProductGallery
          products={filteredProducts}
          showButtons={false}
        />
      </main>
      <Footer />
      <LoginModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
}

export default Home;
