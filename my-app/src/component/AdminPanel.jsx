import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginModal from './LoginModal';
import { variables } from '../Variables';
import { Link } from 'react-router-dom';
import { FaUser, FaTags, FaExclamationCircle } from 'react-icons/fa';
import '../css/adminPanel.css';
import Footer from './Footer';



function AdminPanel() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [listingCount, setListingCount] = useState(0);
    const [unverifiedCount, setUnverifiedCount] = useState(0);
    const [userCount, setUserCount] = useState(0);

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const listingResponse = await axios.get(`${variables.LISTING_API_URL}/count`);
                const unverifiedResponse = await axios.get(`${variables.LISTING_API_URL}/unverified/count`);
                const userResponse = await axios.get(`${variables.LOGIN_API_URL}/count`);

                setListingCount(listingResponse.data);
                setUnverifiedCount(unverifiedResponse.data);
                setUserCount(userResponse.data);
            } catch (err) {
                console.error('API Error:', err.message);
            }
        };

        fetchCounts();
    }, []);

    return (
        <div className='App'>
            <main className="admin-panel-content">
                <div className="admin-panel">
                    <div className="info-blocks">
                        <Link to={`/admin/handleListings`} className="image-card-link">
                            <div className="info-block">
                                <div className="info-block-icon">
                                    <FaTags size={30} />
                                </div>
                                <div className="info-block-content">
                                    <h2>Listings</h2>
                                    <p>{listingCount}</p>
                                </div>
                            </div>
                        </Link>
                        <Link to={`/admin/handleListings`} className="image-card-link">
                        <div className="info-block">
                            <div className="info-block-icon">
                                <FaExclamationCircle size={30} />
                            </div>
                            <div className="info-block-content">
                                <h2>Unverified Listings</h2>
                                <p>{unverifiedCount}</p>
                            </div>
                        </div>
                        </Link>
                        <Link to={`/admin/handleUsers`} className="image-card-link">
                        <div className="info-block">
                            <div className="info-block-icon">
                                <FaUser size={30} />
                            </div>
                            <div className="info-block-content">
                                <h2>Users</h2>
                                <p>{userCount}</p>
                            </div>
                        </div>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
            <LoginModal isOpen={isModalOpen} onClose={toggleModal} />
        </div>
    );
}

export default AdminPanel;
