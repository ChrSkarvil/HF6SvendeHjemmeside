import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './component/Home';
import Watches from './component/Watches';
import About from './component/About';
import Contact from './component/Contact';
import Product from './component/Product';
import Profile from './component/Profile';
import CustomerDashboard from './component/CustomerDashboard';
import AdminPanel from './component/AdminPanel';
import Header from './component/Header';
import LoginModal from './component/LoginModal';
import ListingCreate from './component/ListingCreate';
import { UserProvider } from './component/UserContext';
import './css/home.css';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <UserProvider>
      <Router>
        <Header toggleModal={toggleModal} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/watches" element={<Watches />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/customerDashboard" element={<CustomerDashboard />} />
          <Route path="/listingcreate" element={<ListingCreate />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        {isModalOpen && <LoginModal isOpen={isModalOpen} onClose={toggleModal} />}
      </Router>
    </UserProvider>
  );
}

export default App;
