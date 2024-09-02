import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './component/Home';
import Watches from './component/Watches';
import About from './component/About';
import Contact from './component/Contact';
import Product from './component/Product';
import Profile from './component/Profile';
import CustomerDashboard from './component/CustomerDashboard';
import HandleListings from './component/HandleListings';
import HandleUsers from './component/HandleUsers';
import AdminPanel from './component/AdminPanel';
import Header from './component/Header';
import Breadcrumb from './component/Breadcrumb';
import LoginModal from './component/LoginModal';
import RegisterModal from './component/Register';
import ListingCreate from './component/ListingCreate';
import { UserProvider } from './component/UserContext';
import './css/home.css';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const userRole = useSelector((state) => state.auth.userRole);


  const toggleModal = (type = null) => {
    setModalType(type);
    setModalOpen(type !== null); 
  };

  return (
    <UserProvider>
      <Router>
        <Header toggleModal={toggleModal} />
        <Breadcrumb />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/customerDashboard/profile" element={<Profile />} />
          <Route path="/customerDashboard" element={<CustomerDashboard />} />
          <Route path="/customerDashboard/listingcreate" element={<ListingCreate />} />
          <Route path="/admin" element={userRole !== "Admin" ? <Home/> : <AdminPanel/>} />
          <Route path="/admin/handleListings" element={userRole !== "Admin" ? <Home/> : <HandleListings/>} />
          <Route path="/admin/handleUsers" element={userRole !== "Admin" ? <Home/> : <HandleUsers/>} />
        </Routes>
        {isModalOpen && modalType === 'login' && <LoginModal isOpen={isModalOpen} onClose={() => toggleModal(null)} toggleModal={toggleModal} />}
        {isModalOpen && modalType === 'register' && <RegisterModal isOpen={isModalOpen} onClose={() => toggleModal(null)} toggleModal={toggleModal} />}
      </Router>
    </UserProvider>
  );
}

export default App;
