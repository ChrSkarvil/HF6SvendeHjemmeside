import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const date = new Date(dateString);
  return date.toLocaleString('da-DK', options).replace(',', '');
};

// Reusable component to display a gallery of products
const ProductGallery = ({ products, handleApprove, handleDeny, showButtons }) => {
    return (
    <div className="image-gallery">
      {products.map(product => {
        const productDetails = product.product || {};
        const images = Array.isArray(productDetails.images) ? productDetails.images : [];
        const firstImage = images.length > 0 ? images[0] : null;
        const imageUrl = firstImage ? `data:image/jpeg;base64,${firstImage.fileBase64}` : './assets/default.jpg';
        const formattedDate = formatDate(product.createDate);
        const colors = Array.isArray(productDetails.colors) ? productDetails.colors : [];
    

        return (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="image-card-link">
                <div className="image-card">
                  <div className="customer-info">
                    <div className="profile-name">{product.customerName}</div>
                  </div>
                  <img 
                    src={imageUrl}
                    alt={product.title || 'Product Image'} 
                    onError={(e) => e.target.src = './assets/default.jpg'}
                  />
                  <div className="image-info">
                    <div className="image-name">Name: {product.title || 'No Name'}</div>
                    <div className="image-price">Price: ${product.price || 'No Price'}</div>
                    <div className="image-brand">Brand: {productDetails.brand || 'No Brand'}</div>
                    <div className="image-createdate">CreatedDate: {formattedDate || 'No createdate'}</div>
                  </div>
                </div>
              </Link>
              {showButtons && (
                <div className="button-container">
                  <button onClick={() => handleApprove(product.id)} className="approve-btn">Approve</button>
                  <button onClick={() => handleDeny(product.id)} className="deny-btn">Deny</button>
                </div>
              )}
            </div>
          );
      })}
    </div>
  );
};

export default ProductGallery;
