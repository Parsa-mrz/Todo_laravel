import './bootstrap';
import '../css/app.css';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './components/MainDashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskList from './components/Tasks/TaskList';
import TaskCreate from './components/Tasks/TaskCreate';
import TaskEdit from './components/Tasks/TaskEdit';
import CategoryList from './components/Categories/CategoryList';
import CategoryCreate from './components/Categories/CategoryCreate';
import CategoryEdit from './components/Categories/CategoryEdit';

// Loader Component
const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
    );
};

// Create Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();

    const checkTokenValidity = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const response = await axios.get('/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.data && response.data.data.email) {
                setIsAuthenticated(true);
            } else {
                console.error("Email not found in user data:", response.data);
                localStorage.removeItem('authToken');
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Token validation failed:", error);
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        checkTokenValidity();
    }, [location.pathname]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useContext(AuthContext);

    if (isAuthenticated === null) {
        return <Loader />;
    }

    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const ProtectedLogin = ({ element }) => {
    const { isAuthenticated } = useContext(AuthContext);

    if (isAuthenticated === null) {
        return <Loader />;
    }

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : element;
};

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<ProtectedLogin element={<Login />} />} />
                    <Route path="/register" element={<ProtectedLogin element={<Register />} />} />
                    <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                    
                    {/* Task Routes */}
                    <Route path="/tasks" element={<ProtectedRoute element={<TaskList />} />} />
                    <Route path="/tasks/create" element={<ProtectedRoute element={<TaskCreate />} />} />
                    <Route path="/tasks/edit/:id" element={<ProtectedRoute element={<TaskEdit />} />} />
                    
                    {/* Category Routes */}
                    <Route path="/categories" element={<ProtectedRoute element={<CategoryList />} />} />
                    <Route path="/categories/create" element={<ProtectedRoute element={<CategoryCreate />} />} />
                    <Route path="/categories/edit/:id" element={<ProtectedRoute element={<CategoryEdit />} />} />
                    
                    <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />

                    {/* Catch-all route - redirect to dashboard */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

const root = createRoot(document.getElementById('app'));
root.render(<App />);