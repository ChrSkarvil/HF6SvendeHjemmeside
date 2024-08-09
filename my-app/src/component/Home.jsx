import React from 'react';
import '../css/home.css';
import Footer from './Footer';
import { useLocation, Link } from 'react-router-dom';

function Home() {
  const location = useLocation();

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
          </ul>
        </nav>
      </header>

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
        <div className="image-card">
          <img src="./assets/watch1.jpg" alt="Image 1" />
        </div>
        <div className="image-card">
          <img src="./assets/watch2.jpg" alt="Image 2" />
        </div>
        <div className="image-card">
        <img src="./assets/watch3.jpg" alt="Image 3" />
        </div>
        <div className="image-card">
          <img src="./assets/watch4.jpg" alt="Image 4" />
        </div>
        <div className="image-card">
          <img src="./assets/watch1.jpg" alt="Image 5" />
        </div>
        <div className="image-card">
          <img src="./assets/watch2.jpg" alt="Image 6" />
        </div>
        <div className="image-card">
          <img src="./assets/watch3.jpg" alt="Image 7" />
        </div>
        <div className="image-card">
          <img src="./assets/watch4.jpg" alt="Image 8" />
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
