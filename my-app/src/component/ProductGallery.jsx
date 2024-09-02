import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaExclamationTriangle, FaTimes, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';

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
const ProductGallery = ({
  products,
  handleApprove,
  handleDeny,
  handleDelete,
  showAdminButtons,
  showCustomerButtons,
  handleEdit,
  handleSetStatus,
  listingType,
}) => {
  const renderAdminButtons = (productId) => (
    <div className="button-container">
      <div className="top-buttons">
        {handleApprove && (
          <button onClick={() => handleApprove(productId)} className="approve-btn">
            <FaCheck />Approve
          </button>
        )}
        {handleDeny && (
          <button onClick={() => handleDeny(productId)} className="deny-btn">
            <FaExclamationTriangle />Deny
          </button>
        )}
      </div>
      {handleDelete && (
        <button onClick={() => handleDelete(productId)} className="delete-btn">
          <FaTimes />Delete
        </button>
      )}
    </div>
  );

  const renderCustomerButtons = (productId, isActive) => (
    <div className="button-container">
      <div className="top-buttons">
        {handleEdit && (
          <button onClick={() => handleEdit(productId)} className="edit-btn">
          <FaEdit className='icon'/> Edit
          </button>
        )}
        {handleSetStatus && (
          <button onClick={() => handleSetStatus(productId)} className="status-btn">
            {isActive ? <FaEyeSlash className='icon'/> : <FaEye className='icon'/>} {isActive ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {handleDelete && (
        <button onClick={() => handleDelete(productId)} className="delete-btn">
          <FaTimes className='icon'/>Delete
        </button>
      )}
    </div>
  );

  return (
    <div className="image-gallery">
      {products.map(product => {
        const productDetails = product.product || {};
        const images = Array.isArray(productDetails.images) ? productDetails.images : [];
        const firstImage = images.length > 0 ? images[0] : null;
        const imageUrl = firstImage ? `data:image/jpeg;base64,${firstImage.fileBase64}` : './assets/default.jpg';
        const formattedDate = formatDate(product.createDate);

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
                  <div className="image-createdate">Created Date: {formattedDate || 'No Date'}</div>
                  {listingType === 'denied' && product.denyDate && (
                    <div className="image-denieddate">Denied Date: {formatDate(product.denyDate) || 'No Denied Date'}</div>
                  )}
                  {(showCustomerButtons || showAdminButtons) && (
                    <div className='image-status'>Status: {product.denyDate ? 'Denied' : product.isListingVerified ? 'Approved' : 'Pending Approval'}</div>
                  )}
                </div>
              </div>
            </Link>
            {showAdminButtons && renderAdminButtons(product.id)}
            {showCustomerButtons && renderCustomerButtons(product.id, product.isActive)}
          </div>
        );
      })}
    </div>
  );
};

export default ProductGallery;
