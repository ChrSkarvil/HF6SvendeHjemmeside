import React, { useState } from 'react'; // Import useState from React
import { useParams, Link } from 'react-router-dom'; // Import useParams and Link
import '../css/productDetail.css';
import Footer from './Footer.jsx';
import { useUser } from '../component/UserContext'; 

function Product() {
  const { id } = useParams(); 
  const [isModalOpen, setModalOpen] = useState(false);  
  const { user, logout } = useUser(); // Use the context hook

  // Hardcoded data for the sake of example
  const products = [
    { id: '1', name: 'Rolex', price: '$9000', description: 'This is a watch, nice and very good.', createdBy: 'John Doe', contactInfo: 'john.doe@example.com', image: '/assets/watch1.jpg' },
    { id: '2', name: 'Omega', price: '$5000', description: 'Elegant and precise watch.', createdBy: 'Jane Smith', contactInfo: 'jane.smith@example.com', image: '/assets/watch2.jpg' },
    { id: '3', name: 'Tag Heuer', price: '$3000', description: 'Sporty and reliable watch.', createdBy: 'Robert Brown', contactInfo: 'robert.brown@example.com', image: '/assets/watch3.jpg' },
    { id: '4', name: 'Rolex', price: '$9000', description: 'This is a watch, nice and very good.', createdBy: 'Emily Davis', contactInfo: 'emily.davis@example.com', image: '/assets/watch4.jpg' }
 
  ];

  // Find the product that matches the ID
  const product = products.find(p => p.id === id);

  // If product is not found, show a message
  if (!product) {
    return <div>Product not found.</div>;
  }

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div className="App">
      <div className="product-detail">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-price">{product.price}</p>
          <p className="product-description">{product.description}</p>
          <p className="product-createdBy">Created by: {product.createdBy}</p>
          <p className="product-contactInfo">Contact: {product.contactInfo}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Product;
