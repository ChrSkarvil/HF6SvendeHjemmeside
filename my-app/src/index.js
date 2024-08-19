import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/home.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './component/Home';
import Watches from './component/Watches';
import About from './component/About';
import Contact from './component/Contact';
import Product from './component/Product';
import Profile from './component/Profile';
import { Provider } from 'react-redux';
import store from './redux/store';
import { UserProvider } from './component/UserContext';

 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/watches" element={<Watches />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </UserProvider>
    </Provider>
  </React.StrictMode>
);
