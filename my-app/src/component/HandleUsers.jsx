import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
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
            const loginResponse = await axiosInstance.get(`${variables.LOGIN_API_URL}`);
            setUsers(loginResponse.data);
        } catch (err) {
            console.error('API Error:', err.message);
        }
    };

    const handleReactivate = async (id) => {
        try {
            await axiosInstance.put(
                `${variables.LOGIN_API_URL}/${id}/true`
              );
            alert(`User ${id} reactivated!`);
            fetchUsers();
        } catch (error) {
            alert('Failed to reactivate the user. Please try again.');
        }
    };

    const handleDeactivate = async (id) => {
        try {
            await axiosInstance.put(
                `${variables.LOGIN_API_URL}/${id}/false`
              );
            alert(`User ${id} deactivated!`);
            fetchUsers();
        } catch (error) {
            alert('Failed to deactivate the user. Please try again.');
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
        <div className="handle-users">
            <header className="fixed-header">
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
                <div className="user-info-header">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Customer ID</div>
                    <div>Status</div>
                    <div>Actions</div>
                </div>
            </header>
            <main className="users-content">
                <div className="user-gallery">
                    {filteredUsers.map(user => (
                        <div key={user.id} className="user-card">
                                <div className="user-name">{user.fullName || 'No Name'}</div>
                                <div className="user-email">{user.email || 'No Name'}</div>
                                <div className="user-id">{user.customerId || 'No Name'}</div>
                                <div className="user-status">{user.isActive ? 'Active' : 'Inactive'}</div>
                            <div className="user-button-container">
                                <button onClick={() => handleReactivate(user.id)} className="user-approve-btn">
                                    <FaCheck /> Reactivate
                                </button>
                                <button onClick={() => handleDeactivate(user.id)} className="user-deny-btn">
                                    <FaTimes /> Deactivate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
            <LoginModal isOpen={isModalOpen} onClose={toggleModal} />
        </div>
    );
}

export default HandleUsers;
