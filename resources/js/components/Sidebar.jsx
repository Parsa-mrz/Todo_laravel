// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const response = await axios.get('/api/user', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                if (response.data && response.data.data && response.data.data.email) {
                    setUserEmail(response.data.data.email);
                } else {
                    console.error("Email not found in user data:", response.data);
                }
            } catch (err) {
                console.error('Error fetching user email:', err);
            }
        };

        fetchUserEmail();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const baseButtonStyle = "w-full text-left py-2 px-4 text-lg font-medium text-white rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700";
    const activeButtonStyle = "bg-gray-700 scale-105";

    return (
        <div className="w-64 h-screen bg-gray-800 text-white p-6 space-y-6">
            <div className="text-2xl font-semibold">Dashboard</div>
            <div className="space-y-4">
                <p className="text-sm">Welcome, {userEmail || 'User'}</p>
                <div>
                    <button 
                        className={`${baseButtonStyle} ${location.pathname === '/dashboard' || location.pathname === '/' ? activeButtonStyle : ''}`} 
                        onClick={() => navigate('/dashboard')}
                    >
                        Dashboard
                    </button>
                </div>
                <div>
                    <button 
                        className={`${baseButtonStyle} ${location.pathname === '/tasks' ? activeButtonStyle : ''}`} 
                        onClick={() => navigate('/tasks')}
                    >
                        Tasks
                    </button>
                </div>
                <div>
                    <button 
                        className={`${baseButtonStyle} ${location.pathname === '/categories' ? activeButtonStyle : ''}`} 
                        onClick={() => navigate('/categories')}
                    >
                        Categories
                    </button>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;