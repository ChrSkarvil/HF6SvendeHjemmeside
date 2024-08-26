import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginModal from './LoginModal';
import { variables } from '../Variables'
// import '../css/home.css';
import '../css/handleUsers.css';
import Footer from './Footer';
import { FaCheck, FaTimes } from 'react-icons/fa';


function HandleUsers() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');


    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };

    const fetchUsers = async () => {
        try {
            const loginResponse = await axios.get(`${variables.LOGIN_API_URL}`);
            setUsers(loginResponse.data);
        } catch (err) {
            console.error('API Error:', err.message);
        }
    };

    const handleReactivate = async (id) => {
        const token = localStorage.getItem('token');
        try {
          alert(`User ${id} reactivated!`);
          fetchUsers();
        } catch (error) {
          console.error('Error approving sale:', error);
          alert('Failed to approve the sale. Please try again.');
        }
      };
    
      const handleDeactivate = async (id) => {
        const token = localStorage.getItem('token');
        const currentDateTime = new Date().toISOString();
        try {
          alert(`Sale ${id} deactivated!`);
          fetchUsers();
        } catch (error) {
          console.error('Error approving sale:', error);
          alert('Failed to deny the sale. Please try again.');
        }
      };


    useEffect(() => {
        fetchUsers();
    }, []);


    const filteredUsers = users
        .filter(user => user.userType === 1)
        .filter(user => {
            const searchQueryLower = searchQuery.toLowerCase();
            const matchesEmail = user.email?.toLowerCase().includes(searchQueryLower);
            const matchesName = user.fullName?.toLowerCase().includes(searchQueryLower);
            const matchesId = user.customerId?.toString().toLowerCase().includes(searchQueryLower);
            return matchesEmail || matchesName || matchesId;
        });

    return (
        <div className="App">
            <main className="users-content">
                <div className="search-controls">
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="user-gallery">
                    {filteredUsers.map(user => {
                        return (
                            <div key={user.id} className="user-card">
                                <div className="image-card">
                                    <div className="user-info">
                                        <div className="user-name">Name: {user.fullName || 'No Name'}</div>
                                        <div className="user-email">Email: {user.email || 'No Name'}</div>
                                        <div className="user-id">Customer ID: {user.customerId || 'No Name'}</div>
                                        <div className="user-status">Status: {user.isActive ? 'Active' : 'Inactive'}</div>
                                    </div>
                                </div>
                                <div className="button-container">
                                    <button onClick={() => handleReactivate(user.id)} className="approve-btn"><FaCheck />Reactivate</button>
                                    <button onClick={() => handleDeactivate(user.id)} className="deny-btn"><FaTimes />Deactivate</button>
                                </div>
                            </div>

                        );
                    })}
                </div>
            </main>
            <Footer />
            <LoginModal isOpen={isModalOpen} onClose={toggleModal} />
        </div>
    );
}

export default HandleUsers;
