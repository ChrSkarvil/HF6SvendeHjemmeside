import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import '../css/category.css';

const Category = ({ filters, setFilters }) => {
  const [sizeOptions, setSizeOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);

  useEffect(() => {
    const fetchProductAttributes = async () => {
      try {
        const response = await axios.get('https://hf6svendeapi-d5ebbcchbdcwcybq.northeurope-01.azurewebsites.net/api/Product');
        const products = response.data;

        const uniqueSizes = [...new Set(products.map(product => product.size))].map(size => ({
          value: size,
          label: size,
        }));
        
        const uniqueColors = [...new Set(products.map(product => product.colors))].map(color => ({
          value: color,
          label: color.charAt(0).toUpperCase() + color.slice(1),  
        }));

        const uniqueBrands = [...new Set(products.map(product => product.brand))].map(brand => ({
          value: brand,
          label: brand.charAt(0).toUpperCase() + brand.slice(1),  
        }));

        setSizeOptions(uniqueSizes);
        setColorOptions(uniqueColors);
        setBrandOptions(uniqueBrands);
      } catch (error) {
        console.error('Error fetching product attributes:', error);
      }
    };

    fetchProductAttributes();
  }, []);

  const handleSelectChange = (selectedOption, actionMeta) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [actionMeta.name]: selectedOption ? selectedOption.value : '',
    }));
  };

  return (
    <div className="filter-container">
{/* <div className="gender-filter">
  <label>
    <input
      type="checkbox"
      checked={filters.gender === 'male'}
      onChange={() =>
        setFilters(prevFilters => ({
          ...prevFilters,
          gender: prevFilters.gender === 'male' ? '' : 'male',
        }))
      }
    />
    Male
  </label>
  <label>
    <input
      type="checkbox"
      checked={filters.gender === 'female'}
      onChange={() =>
        setFilters(prevFilters => ({
          ...prevFilters,
          gender: prevFilters.gender === 'female' ? '' : 'female',
        }))
      }
    />
    Female
  </label>
</div>

      <div className="price-range">
        <label>
          Min Price: $
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters(prevFilters => ({
                ...prevFilters,
                minPrice: e.target.value,
              }))
            }
            placeholder="Min"
          />
        </label>
        <label>
          Max Price: $
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters(prevFilters => ({
                ...prevFilters,
                maxPrice: e.target.value,
              }))
            }
            placeholder="Max"
          />
        </label>
      </div> */}
{/* 
      <div className="select-filter">
        <label>Size</label>
        <Select
          name="size"
          options={sizeOptions}
          onChange={handleSelectChange}
          placeholder="Select Size"
          isClearable
          isSearchable
        />
      </div>

      <div className="select-filter">
        <label>Color</label>
        <Select
          name="color"
          options={colorOptions}
          onChange={handleSelectChange}
          placeholder="Select Color"
          isClearable
          isSearchable
        />
      </div>

      <div className="select-filter">
        <label>Brand</label>
        <Select
          name="brand"
          options={brandOptions}
          onChange={handleSelectChange}
          placeholder="Select Brand"
          isClearable
          isSearchable
        />
      </div> */}
    </div>
  );
};

export default Category;
