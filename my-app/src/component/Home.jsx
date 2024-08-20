import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import '../css/home.css';
import Footer from './Footer';

const products = [
  { id: 1, name: 'Rolex', price: '$9000', description: 'This is a watch, nice and very good.', image: './assets/watch1.jpg' },
  { id: 2, name: 'Omega', price: '$5000', description: 'Elegant and precise watch.', image: './assets/watch2.jpg' },
  { id: 3, name: 'Tag Heuer', price: '$3000', description: 'Sporty and reliable watch.', image: './assets/watch3.jpg' },
  { id: 4, name: 'Rolex', price: '$9000', description: 'This is a watch, nice and very good.', image: './assets/watch4.jpg' },
  { id: 5, name: 'Rolex', price: '$9000', description: 'This is a watch, nice and very good.', image: './assets/watch3.jpg' },
  { id: 6, name: 'Omega', price: '$5000', description: 'Elegant and precise watch.', image: './assets/watch2.jpg' },
  { id: 7, name: 'Tag Heuer', price: '$3000', description: 'Sporty and reliable watch.', image: './assets/watch3.jpg' },
  { id: 8, name: 'Rolex', price: '$9000', description: 'This is a watch, nice and very good.', image: './assets/watch4.jpg' },
];

function Home() {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div className="App">
      <main className="App-content">
        <div className='search-container'>
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
          />
          <button className='filter-button'>Filter</button>
        </div>

        <div className="image-gallery">
          {products.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="image-card-link">
              <div className="image-card">
                <img src={product.image} alt={`${product.name}`} />
                <div className="image-info">
                  <div className="image-name">Name: {product.name}</div>
                  <div className="image-price">Price: {product.price}</div>
                  <div className="image-description">Description: {product.description}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
      <LoginModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
}

export default Home;
