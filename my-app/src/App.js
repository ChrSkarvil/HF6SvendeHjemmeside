import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './component/Home';
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
import ResetPassword from './component/ResetPassword';
import LoginModal from './component/LoginModal';
import RegisterModal from './component/Register';
import CustomPopup from './component/CustomPopup';
import ListingCreate from './component/ListingCreate';
import OrderPage from './component/OrderPage';
import { UserProvider } from './component/UserContext';
import './css/home.css';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const userRole = useSelector((state) => state.auth.userRole);

  const toggleModal = (type = null) => {
    setModalType(type);
    setModalOpen(type !== null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  const closePopup = () => {
    setPopupMessage('');
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
          <Route path="/customerDashboard/profile" element={userRole !== "Customer" ? <Navigate to="/" /> : <Profile />} />
          <Route path="/customerDashboard" element={userRole !== "Customer" ? <Navigate to="/" /> : <CustomerDashboard />} />
          <Route path="/customerDashboard/listingcreate" element={userRole !== "Customer" ? <Navigate to="/" /> : <ListingCreate />} />
          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="/admin" element={userRole !== "Admin" ? <Navigate to="/" /> : <AdminPanel />} />
          <Route path="/admin/handleListings" element={userRole !== "Admin" ? <Navigate to="/" /> : <HandleListings />} />
          <Route path="/admin/handleUsers" element={userRole !== "Admin" ? <Navigate to="/" /> : <HandleUsers />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        <CustomPopup message={popupMessage} onClose={closePopup} />
        
        {isModalOpen && modalType === 'login' && <LoginModal isOpen={isModalOpen} onClose={handleCloseModal} toggleModal={toggleModal} />}
        {isModalOpen && modalType === 'register' && <RegisterModal isOpen={isModalOpen} onClose={handleCloseModal} toggleModal={toggleModal} />}
        {isModalOpen && modalType === 'resetPassword' && <ResetPassword isOpen={isModalOpen} onClose={handleCloseModal} />}
      </Router>
    </UserProvider>
  );
}

export default App;
