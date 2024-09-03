import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../css/listingcreate.css';
import axios from 'axios';
import { variables } from '../Variables';
import axiosInstance from '../services/axiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';

const ListingForm = ({ }) => {
  const { userId: userIdFromRedux } = useSelector(state => state.auth);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const listingId = queryParams.get('listingId');
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imageIdsToRemove, setImageIdsToRemove] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [gender, setGender] = useState('male');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [userId, setUserId] = useState(userIdFromRedux);
  const [isListingVerified, setIsListingVerified] = useState(true);
  const MAX_IMAGES = 15;

  const aiDetectionURL = 'https://detect.roboflow.com/watch-detection-pcn5i/1';
  const apiKey = 'VRERCE01WIVmSiPNKe5t';

  useEffect(() => {
    if (!userId) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUserId(parsedUser.userId);
      }
    }
  }, [userId]);

  // Get color options from the database
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axiosInstance.get(`${variables.COLOR_API_URL}`);
        const options = response.data.map(color => ({
          value: color.id,
          label: color.name,
        }));
        setColorOptions(options);
      } catch (error) {
        console.error('Error getting color options:', error);
      }
    };

    fetchColors();
  }, []);

  // Get existing listing, if updating
  useEffect(() => {
    if (listingId) {
      const fetchListingDetails = async () => {
        try {
          const response = await axiosInstance.get(`${variables.LISTING_API_URL}/${listingId}`);
          const listing = response.data;

          setTitle(listing.title);
          setPrice(listing.price);
          setIsActive(listing.isActive);
          setBrand(listing.product.brand);
          setDescription(listing.product.description);
          setSize(listing.product.size);
          setIsListingVerified(listing.isListingVerified)

          // Map colors back to Select's value format
          const selectedColors = listing.product.colors.map(color => ({
            label: color.name,
            value: color.id
          }));
          setColor(selectedColors);

          const existingImages = listing.product.images.map(image => ({
            id: image.id,
            url: `data:image/jpeg;base64,${image.fileBase64}`
          }));
          setImages(existingImages);

        } catch (error) {
          console.error('Error fetching listing details:', error);
        }
      };

      fetchListingDetails();
    }
  }, [listingId]);


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
    if (files.length === 0) return;

    const totalImages = images.length + files.length;

    if (totalImages > MAX_IMAGES) {
      files.length = MAX_IMAGES - images.length;
    }

    const base64Images = await Promise.all(files.map(file => convertFileToBase64(file)));

    setNewImages(prevNewImages => {
      const updatedNewImages = [...prevNewImages, ...base64Images];
      return updatedNewImages.slice(0, MAX_IMAGES - images.length);
    });
  }, [images]);

  const handleRemoveImage = useCallback((index, imageId) => {
    const imageIdStr = String(imageId);

    // Check if image is new
    if (imageIdStr.startsWith('new-')) {
      // Remove the new image from the newImages state
      setNewImages(prevNewImages => prevNewImages.filter((_, i) => i !== index));
    } else {
      // Remove the existing image from the images state
      setImageIdsToRemove(prevImageIdsToRemove => [...prevImageIdsToRemove, imageIdStr]);
      setImages(prevImages => prevImages.filter((_, i) => i !== index));
    }
  }, []);

  // Validate images using AI model
  const validateImages = async () => {
    const imagesToValidate = listingId ? newImages : images.concat(newImages); // Validate only new images if updating

    const promises = imagesToValidate.map(async (image) => {
      const base64String = typeof image === 'string' ? image.split(',')[1] : null; // Remove 'data:image/jpeg;base64' from image

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

        // Check if any image is a valid watch with confidence > 50%
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

    // Validate only if there are new images
    let isListingValidated = isListingVerified;
    if (newImages.length > 0) {
      isListingValidated = await validateImages();
    }
    console.log('isvalidated?', isListingValidated);
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
    // Updating a listing
    if (listingId) {
      formData.append('Brand', brand);
      formData.append('Description', description);
      formData.append('Size', size);
      if (imageIdsToRemove.length > 0) {
        imageIdsToRemove.forEach(imageId => {
          formData.append('ImageIdsToRemove', imageId);
        });
      }
      color.forEach(c => formData.append('ColorNames', c.label));
      const newImagesBlobs = await Promise.all(newImages.map(async (image, index) => {
        const byteString = atob(image.split(',')[1]); // Remove 'data:image/jpeg;base64' from image
        const mimeString = image.split(',')[0].split(':')[1].split(';')[0]; // Get mimetype image/jpeg
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        return blob;
      }));

      newImagesBlobs.forEach((blob, index) => {
        formData.append('NewImages', blob, `image${index}.jpg`);
      });
      // Creating a listing
    } else {
      // Handle new images for a new listing
      const allImages = [...images, ...newImages];

      const imageBlobs = await Promise.all(allImages.map(async (image, index) => {
        const byteString = atob(image.split(',')[1]); // Remove 'data:image/jpeg;base64' from image
        const mimeString = image.split(',')[0].split(':')[1].split(';')[0]; // Get mimetype image/jpeg
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        return blob;
      }));

      imageBlobs.forEach((blob, index) => {
        formData.append('Product.Images', blob, `image${index}.jpg`);
      });
      // Append ProductCreateDTO fields
      formData.append('Product.Brand', brand);
      formData.append('Product.Description', description);
      formData.append('Product.Size', size);
      formData.append('Product.CategoryId', categoryId);
      color.forEach(c => formData.append('Product.ColorNames', c.label));
    }

    let errorMessage = '';

    if (!title) errorMessage += 'Title is required. ';
    if (listingId ? images.length === 0 && newImages.length === 0 : newImages.length === 0) errorMessage += 'At least one image is required. ';
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
      if (listingId) {
        // Update existing listing
        await axiosInstance.put(`${variables.LISTING_API_URL}/${listingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Listing updated successfully!');
      } else {
        // Create new listing
        await axiosInstance.post(`${variables.LISTING_API_URL}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Listing created successfully!');
      }
      navigate('/customerDashboard');
    } catch (error) {
      console.error('Error submitting listing:', error);
      setError('An error occurred while submitting the listing.');
    }
  };

  return (
    <div className="listing-container">
      <h2>{listingId ? 'Update Listing' : 'Create a Listing'}</h2>
      <form onSubmit={handleSubmit} className="listing-form">
        <div className="image-section">
          <h3>Add Images</h3>
          <div className="file-input-wrapper">
            {images.length + newImages.length < MAX_IMAGES && (
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
                  style={{ display: 'none' }}
                />
              </>
            )}
            <p className="info-message">You can upload up to {MAX_IMAGES} images.</p>
          </div>
          <div className="image-preview-container">
            {images.map((image, index) => (
              <div className="image-preview" key={image.id}>
                <img src={image.url} alt={`Preview ${index}`} />
                <button onClick={() => handleRemoveImage(index, image.id)} type="button">Remove</button>
              </div>
            ))}
            {newImages.map((image, index) => (
              <div className="image-preview" key={`new-${index}`}>
                <img src={image} alt={`New Preview ${index}`} />
                <button onClick={() => handleRemoveImage(index, `new-${index}`)} type="button">Remove</button>
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
          <p>Your cut: ${(price * 0.95).toFixed()}</p>
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
