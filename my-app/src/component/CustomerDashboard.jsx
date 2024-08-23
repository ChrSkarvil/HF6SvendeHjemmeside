import React, { useState } from 'react'; // Import useState from React
import { useParams, Link } from 'react-router-dom'; // Import useParams and Link
import '../css/customerDashboard.css';
import Footer from './Footer.jsx';
import { useUser } from '../component/UserContext'; 

function CustomerDashboard() {
  const { id } = useParams(); 
  const { user, logout } = useUser();


  return (
    <div className="App">
        <p>godaften</p>
      <Footer />
    </div>
  );
}

export default CustomerDashboard;


