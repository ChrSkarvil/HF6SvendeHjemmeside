import React from 'react';
import '../css/imageModal.css';

const ImageModal = ({ images, currentIndex, onClose, onNext, onPrevious }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-prev-button" onClick={onPrevious}>&#10094;</button>
        <img
          src={`data:image/jpeg;base64,${images[currentIndex].fileBase64}`}
          alt="Product"
          className="modal-image"
        />
        <button className="modal-next-button" onClick={onNext}>&#10095;</button>
      </div>
    </div>
  );
};

export default ImageModal;
