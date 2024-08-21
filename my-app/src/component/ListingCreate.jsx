import React, { useState, useCallback } from 'react';
import '../css/listingcreate.css';
import axios from 'axios';

const ListingForm = () => {
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const MAX_IMAGES = 15;

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

    if (!title || !images.length || !price || !description) {
      setError('Please fill all required fields.');
      return;
    }

    setError('');

    const formData = {
      title,
      images,
      price,
      description,
    };
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
                  Choose Files
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
            required
          />
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ListingForm;
