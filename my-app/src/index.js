import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/home.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './component/Home';
import Watches from './component/Watches';
import About from './component/About';
import Contact from './component/Contact';
import Product from './component/Product';
import { Provider } from 'react-redux';
import store from './redux/store';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/watches" element={<Watches />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
