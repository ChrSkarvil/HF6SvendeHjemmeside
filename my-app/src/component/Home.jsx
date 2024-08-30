import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginModal from './LoginModal';
import '../css/home.css';
import Footer from './Footer';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import ProductGallery from './ProductGallery';

function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [genders, setGenders] = useState([]);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    gender: [],
    brand: [],
    newest: false,
    highToLow: false,
    lowToHigh: false,
  });

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const toggleFilter = () => {
    setFilterOpen(!isFilterOpen);
  };

  const clearFilters = () => {
    setFilters({
      gender: [],
      brand: [],
      newest: false,
      highToLow: false,
      lowToHigh: false,
    });
    setSearchQuery('');
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;

    setFilters((prevFilters) => {
      if (name === 'gender') {
        const updatedGender = checked
          ? [...prevFilters.gender, value]
          : prevFilters.gender.filter(g => g !== value);
        return {
          ...prevFilters,
          gender: updatedGender,
        };
      }

      if (name === 'brand') {
        const updatedBrand = checked
          ? [...prevFilters.brand, value]
          : prevFilters.brand.filter(b => b !== value);
        return {
          ...prevFilters,
          brand: updatedBrand,
        };
      }

      if (name === 'sort') {
        return {
          ...prevFilters,
          [value]: checked,
        };
      }

      return {
        ...prevFilters,
        [name]: checked,
      };
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get('https://hf6svendeapi-d5ebbcchbdcwcybq.northeurope-01.azurewebsites.net/api/Listing/verified');
        
        console.log('Fetched Products:', productResponse.data);
  
        setProducts(productResponse.data);

        const uniqueBrands = [...new Set(productResponse.data.map(product => product.product.brand))];
        console.log('Unique Brands:', uniqueBrands);
        setBrands(uniqueBrands);

        const uniqueGenders = [...new Set(productResponse.data.map(product => product.product.gender))];
        console.log('Unique Genders:', uniqueGenders);
        setGenders(uniqueGenders);
  
      } catch (err) {
        console.error('API Error:', err.message);
      }
    };
  
    fetchProducts();
  }, []);
  
  const filteredProducts = products
    .filter(product => {
      const searchQueryLower = searchQuery.toLowerCase();
      const matchesSearchQuery = 
        product.title?.toLowerCase().includes(searchQueryLower) ||
        product.product.brand?.toLowerCase().includes(searchQueryLower) ||
        product.customerName?.toLowerCase().includes(searchQueryLower);

      const matchesGender = !filters.gender.length || filters.gender.includes(product.product.gender);
      const matchesBrand = !filters.brand.length || filters.brand.includes(product.product.brand);

      const createDate = new Date(product.createDate);
      const isNewest = createDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const matchesNewest = !filters.newest || isNewest;

      return matchesSearchQuery && matchesGender && matchesBrand && matchesNewest;
    })
    .sort((a, b) => {
      if (filters.highToLow) {
        return b.price - a.price;
      }
      if (filters.lowToHigh) {
        return a.price - b.price;
      }
      if (filters.newest) {
        return new Date(b.createDate) - new Date(a.createDate);
      }
      return 0;
    });

    const slideBack = () => {
      setFilterOpen(false);
    };

  return (
    <div className={`App ${isFilterOpen ? 'filter-open' : ''}`}>
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
              <button className="filter-button" onClick={toggleFilter}>
                Filter
              </button>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 && searchQuery && (
          <div className="no-products">No products found</div>
        )}

        {filteredProducts.length === 0 && !searchQuery && (
          <div className="no-products">No products match the selected filters</div>
        )}

        <ProductGallery
          products={filteredProducts}
          showButtons={false}
        />
      </main>
      <Footer />
      <LoginModal isOpen={isModalOpen} onClose={toggleModal} />

      <div className={`filter-menu ${isFilterOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h3>Filter Options</h3>
          <button className="clear-button" onClick={clearFilters}>Clear</button>
        </div>
        <div className="filter-options">
          <h4>Gender</h4>
          {genders.map(gender => (
            <label key={gender}>
              <input
                type="checkbox"
                name="gender"
                value={gender}
                checked={filters.gender.includes(gender)}
                onChange={handleCheckboxChange}
              />
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </label>
          ))}

          <h4>Sort By</h4>
          <label>
            <input
              type="checkbox"
              name="newest"
              checked={filters.newest}
              onChange={handleCheckboxChange}
            />
            Newest
          </label>
          <label>
            <input
              type="checkbox"
              name="sort"
              value="highToLow"
              checked={filters.highToLow}
              onChange={handleCheckboxChange}
            />
            Price: High - Low
          </label>
          <label>
            <input
              type="checkbox"
              name="sort"
              value="lowToHigh"
              checked={filters.lowToHigh}
              onChange={handleCheckboxChange}
            />
            Price: Low - High
          </label>

          <h4>Brand</h4>
          {brands.map((brand) => (
            <label key={brand}>
              <input
                type="checkbox"
                name="brand"
                value={brand}
                checked={filters.brand.includes(brand)}
                onChange={handleCheckboxChange}
              />
              {brand}
            </label>
          ))}
        </div>
        <FaArrowAltCircleLeft className="arrow-icon" onClick={slideBack} />

      </div>

      {isFilterOpen && <div className="overlay" onClick={toggleFilter}></div>}
    </div>
  );
}

export default Home;
