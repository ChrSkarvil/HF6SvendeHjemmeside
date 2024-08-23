import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  const { userId } = useSelector(state => state.auth);
  const MAX_IMAGES = 15;

  const apiBaseURL = 'https://hf6svendeapi-d5ebbcchbdcwcybq.northeurope-01.azurewebsites.net/api';
  const aiDetectionURL = 'https://detect.roboflow.com/watch-detection-pcn5i/1';
  const apiKey = 'VRERCE01WIVmSiPNKe5t';

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
    document.getElementById('fileInput').click();
  }, []);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageChange = useCallback(async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return; // No files selected, do nothing
  
    const totalImages = images.length + files.length;
  
    if (totalImages > MAX_IMAGES) {
      files.length = MAX_IMAGES - images.length;
    }
  
    const base64Images = await Promise.all(files.map(file => convertFileToBase64(file)));
    
    setImages(prevImages => {
      const updatedImages = [...prevImages, ...base64Images];
      return updatedImages.slice(0, MAX_IMAGES); // Make sure the total number of images does not exceed MAX_IMAGES
    });
  }, [images]);

  const handleRemoveImage = useCallback((index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  }, []);

  // Validate images using AI model
  const validateImages = async () => {
    const promises = images.map(async (image) => {
      const base64String = image.split(',')[1]; // Remove 'data:image/jpeg;base64' from image
  
      if (!base64String) {
        console.error("Empty Base64 string");
        return false;
      }
  
      try {
        const response = await axios({
          method: 'POST',
          url: aiDetectionURL,
          params: {
            api_key: apiKey
          },
          data: base64String,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
  
        // Check if any image is a valid watch with confidence > 60%
        const isValid = response.data.predictions.some(pred => pred.class === 'watches' && pred.confidence > 0.50);
        console.log('Image Validity:', isValid);
        return isValid;
      } catch (error) {
        console.error('Error validating image:', error);
        return false;
      }
    });
  
    const results = await Promise.all(promises);
    return results.every(isValid => isValid);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('userid: ',userId);

    const isListingValidated = await validateImages();
    const IsActive = true;
    const categoryId = gender === 'male' ? 2 : gender === 'female' ? 3 : 0;

    if (!userId) {
      setError('User ID not found. Please log in.');
      return;
    }

    const formData = new FormData();
    formData.append('Title', title);
    formData.append('Price', price);
    formData.append('IsActive', IsActive);
    formData.append('IsListingVerified', isListingValidated);
    formData.append('CustomerId', userId);

    // Append ProductCreateDTO fields
    formData.append('Product.Brand', brand);
    formData.append('Product.Description', description);
    formData.append('Product.Size', size);
    formData.append('Product.CategoryId', categoryId);
    
    color.forEach(c => formData.append('Product.ColorNames', c.label));

        // Append images
        images.forEach((image, index) => {
          // Convert Base64 to Blob
          const byteString = atob(image.split(',')[1]);
          const mimeString = image.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });
          formData.append('Product.Images', blob, `image${index}.jpg`);
      });

    let errorMessage = '';

    if (!title) errorMessage += 'Title is required. ';
    if (images.length === 0) errorMessage += 'At least one image is required. ';
    if (!price) errorMessage += 'Price is required. ';
    if (!description) errorMessage += 'Description is required. ';
    if (!gender) errorMessage += 'Gender selection is required. ';
    if (!brand) errorMessage += 'Brand is required. ';
    if (!size) errorMessage += 'Size is required. ';
    if (color.length === 0) errorMessage += 'Color is required. ';
    
    if (errorMessage) {
      setError(errorMessage.trim());
      return;
    }
  
    setError(''); // Clear the error if no issues

    try {
      await axios.post(`${apiBaseURL}/listing`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data' // Important: This ensures the request is sent as multipart
          }
      });
      alert('Listing created successfully!');
  } catch (error) {
      console.error('Error submitting listing:', error);
      setError('An error occurred while submitting the listing.');
  }
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
