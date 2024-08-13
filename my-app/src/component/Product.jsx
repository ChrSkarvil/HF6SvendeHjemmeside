import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../css/productDetail.css';
import Footer from "./Footer.jsx";


function Product() {
  const { id } = useParams(); // Get the product ID from the URL

  // Hardcoded data for the sake of example
  const products = [
    { id: '1', name: 'Rolex', price: '$9000', description: 'This is a watch, nice and very good.', createdBy: 'John Doe', contactInfo: 'john.doe@example.com', image: '/assets/watch1.jpg' },
    { id: '2', name: 'Omega', price: '$5000', description: 'Elegant and precise watch.', createdBy: 'Jane Smith', contactInfo: 'jane.smith@example.com', image: '/assets/watch2.jpg' },
    { id: '3', name: 'Tag Heuer', price: '$3000', description: 'Sporty and reliable watch.', createdBy: 'Robert Brown', contactInfo: 'robert.brown@example.com', image: '/assets/watch3.jpg' },
    { id: '4', name: 'Rolex', price: '$9000', description: 'This is a watch, nice and very good.', createdBy: 'Emily Davis', contactInfo: 'emily.davis@example.com', image: '/assets/watch4.jpg' }
    // Add more products if needed
  ];

  // Find the product that matches the ID
  const product = products.find(p => p.id === id);

  // If product is not found, show a message
  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="App">
    <header className="App-header">
      <h1>Demmacs Watches</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/watches">Watches</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/login" className='login-button'>Login</Link></li>
        </ul>
      </nav>
    </header>
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
    <Footer></Footer>
    </div>
  );
}

export default Product;
