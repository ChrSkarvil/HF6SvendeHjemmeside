import React, { useState, useCallback, useEffect } from 'react';
import '../css/listingcreate.css';
import axios from 'axios';
import Select from 'react-select';

const ListingForm = () => {
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [gender, setGender] = useState('male');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [validatedImages, setValidatedImages] = useState([]);
  const MAX_IMAGES = 15;

  const apiBaseURL = 'https://hf6svendeapi-d5ebbcchbdcwcybq.northeurope-01.azurewebsites.net/api';


  // Fetch color options from the database
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axios.get(`${apiBaseURL}/color`);
        const options = response.data.map(color => ({
          value: color.id,
          label: color.name,
        }));
        setColorOptions(options);
      } catch (error) {
        console.error('Error fetching color options:', error);
      }
    };

    fetchColors();
  }, []);

  const handleFileInputClick = useCallback(() => {
    document.getElementById('fileInput').click(); // Trigger the hidden file input
  }, []);

  const handleImageChange = useCallback((event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return; // No files selected, do nothing

    const totalImages = images.length + files.length;
    
    if (totalImages > MAX_IMAGES) {
      files.length = MAX_IMAGES - images.length; // Trim the array to the maximum allowed
    }

    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => {
      const updatedImages = [...prevImages, ...newImages];
      return updatedImages.slice(0, MAX_IMAGES); // Ensure the total number of images does not exceed MAX_IMAGES
    });
  }, [images]);

  const handleRemoveImage = useCallback((index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      title,
      images,
      price,
      description,
      gender,
      brand,
      size,
      color: color.map(c => c.label)
    };

    let errorMessage = '';

    if (!formData.title) errorMessage += 'Title is required. ';
    if (!formData.images.length) errorMessage += 'At least one image is required. ';
    if (!formData.price) errorMessage += 'Price is required. ';
    if (!formData.description) errorMessage += 'Description is required. ';
    if (!formData.gender) errorMessage += 'Gender selection is required. ';
    if (!formData.brand) errorMessage += 'Brand is required. ';
    if (!formData.size) errorMessage += 'Size is required. ';
    if (!formData.color) errorMessage += 'Color is required. ';
    
    if (errorMessage) {
      setError(errorMessage.trim());
      return;
    }
  
    setError(''); // Clear the error if no issues
  };

  return (
    <div className="listing-container">
      <h2>Create a Listing</h2>
      <form onSubmit={handleSubmit} className="listing-form">
        <div className="image-section">
          <h3>Add Images</h3>
          <div className="file-input-wrapper">
          {images.length < MAX_IMAGES && (
              <>
                <button type="button" className="custom-file-button" onClick={handleFileInputClick}>
                  Add Images
                </button>
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }} // Hide default file input
                />
              </>
            )}
            <p className="info-message">You can upload up to {MAX_IMAGES} images.</p>
          </div>
          <div className="image-preview-container">
            {images.map((image, index) => (
              <div className="image-preview" key={index}>
                <img src={image} alt={`Preview ${index}`} />
                <button onClick={() => handleRemoveImage(index)} type="button">Remove</button>
              </div>
            ))}
          </div>
        </div>
        <div className="details-section">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className='product-section'>
        <div className='gender-section'>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={(e) => setGender(e.target.value)}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={(e) => setGender(e.target.value)}
              />
              Female
            </label>
          </div>
          <label htmlFor="brand">Brand:</label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <label htmlFor="size">Size:</label>
          <input
            type="text"
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
           <label htmlFor="color">Color:</label>
          <Select
            isMulti
            name="color"
            options={colorOptions}
            className="basic-multi-select select-container"
            classNamePrefix="select"
            value={color}
            onChange={setColor}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ListingForm;
