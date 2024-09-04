import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ImageModal from './ImageModal';
import LoginModal from './LoginModal';
import { useSelector } from 'react-redux';
import '../css/productDetail.css';
import '../css/products.css';
import { variables } from '../Variables';

function ProductDetails() {
  const { userId: userIdFromRedux } = useSelector(state => state.auth);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userId, setUserId] = useState(userIdFromRedux);
  const navigate = useNavigate();
  

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

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

  const handleBuyNow = () => {
    if (isLoggedIn) {
      navigate(`/order/${id}`);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  useEffect(() => {
    if (!userId) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUserId(parsedUser.userId);
      }
    }
  }, [userId]);

  if (!product) {
    return <div></div>;
  }


  const { title, price, createDate, customerName } = product;
  const images = product.product.images;
  const colors = product.product.colors || [];

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
        <p><strong>Colors:</strong> {colors.length > 0 ? colors.map(color => color.name).join(', ') : 'No colors available'}</p>
        <p><strong>Description:</strong> {product.product.description}</p>
        <p><strong>Size:</strong> {product.product.size}</p>
        <p><strong>Gender:</strong> {product.product.gender}</p>
        <p><strong>Customer Name:</strong> {customerName}</p>
        {userId !== product.customerId && (
          <>
            <button className="buy-now" onClick={handleBuyNow}>Buy now</button>
            <button className="make-offer">Make an offer</button>
            <button className="contact-seller">Contact seller</button>
          </>
        )}
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

      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={handleLoginModalClose}
          toggleModal={() => {}}
        />
      )}
    </div>
  );
}

export default ProductDetails;
