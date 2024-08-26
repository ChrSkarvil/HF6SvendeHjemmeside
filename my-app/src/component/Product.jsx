import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/productDetail.css';
import '../css/products.css'; 
import { variables } from '../Variables';

function ProductDetails() {
  const { id } = useParams();  
  const [product, setProduct] = useState(null);
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

  const handleNextImage = () => {
    if (product && product.product.images && currentImageIndex < product.product.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (!product) {
    return <div></div>;
  }

  const { title, price, createDate, customerName } = product;
  const images = product.product.images;
  const colors = product.product.colors || []; 

  return (
    <div className="product-details">
      <div className="image-slideshow">
        {images && images.length > 0 && (
          <>
            <button className="prev-button" onClick={handlePreviousImage}>&#10094;</button>
            <img
              src={`data:image/jpeg;base64,${images[currentImageIndex].fileBase64}`}
              alt={title || 'Product Image'}
              className="product-image"
            />
            <button className="next-button" onClick={handleNextImage}>&#10095;</button>
          </>
        )}
      </div>
      <div className="product-info">
        <h2>{title}</h2>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Create Date:</strong> {new Date(createDate).toLocaleDateString()}</p>
        <p><strong>Brand:</strong> {product.product.brand}</p>
        <p><strong>Description:</strong> {product.product.description}</p>
        <p><strong>Size:</strong> {product.product.size}</p>
        <p><strong>Colors:</strong> 
          {Array.isArray(colors) && colors.length > 0 ? (
            colors.map((color) => (
              <span key={color.id} className="color-name"> {color.name}</span>
            ))
          ) : (
            <span>No colors available</span>
          )}
        </p>
        <p><strong>Gender:</strong> {product.product.gender}</p>
        <p><strong>Customer Name:</strong> {customerName}</p>
      </div>
    </div>
  );
}

export default ProductDetails;
