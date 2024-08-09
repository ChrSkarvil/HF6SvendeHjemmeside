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
      </main>

      <Footer />
    </div>
  );
}

export default Home;
