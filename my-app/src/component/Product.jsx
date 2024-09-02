import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ImageModal from './ImageModal';
import '../css/productDetail.css';
import '../css/products.css';
import { variables } from '../Variables';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${variables.LISTING_API_URL}/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.product.images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex === 0 ? product.product.images.length : prevIndex) - 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const { title, price, createDate, customerName } = product;
  const images = product.product.images;

  return (
    <div className="product-details">
      <div className="image-gallery">
        <div className="thumbnail-container">
          <div className="thumbnail-arrow" onClick={handlePreviousImage}>&#10094;</div>
          {images && images.length > 0 && images.map((image, index) => (
            <img
              key={index}
              src={`data:image/jpeg;base64,${image.fileBase64}`}
              alt={title || 'Product Image'}
              className={`thumbnail-image ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
          <div className="thumbnail-arrow" onClick={handleNextImage}>&#10095;</div>
        </div>
      </div>

      <div className="main-image" onClick={() => handleImageClick(currentImageIndex)}>
        <img
          src={`data:image/jpeg;base64,${images[currentImageIndex].fileBase64}`}
          alt={title || 'Product Image'}
        />
      </div>

      <div className="product-info">
        <h2>{title}</h2>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Create Date:</strong> {new Date(createDate).toLocaleDateString()}</p>
        <p><strong>Brand:</strong> {product.product.brand}</p>
        <p><strong>Description:</strong> {product.product.description}</p>
        <p><strong>Size:</strong> {product.product.size}</p>
        <p><strong>Gender:</strong> {product.product.gender}</p>
        <p><strong>Customer Name:</strong> {customerName}</p>
        <button className="buy-now">Buy now</button>
        <button className="make-offer">Make an offer</button>
        <button className="contact-seller">Contact seller</button>
      </div>

      {isModalOpen && (
        <ImageModal
          images={images}
          currentIndex={currentImageIndex}
          onClose={closeModal}
          onNext={handleNextImage}
          onPrevious={handlePreviousImage}
        />
      )}
    </div>
  );
}

export default ProductDetails;
