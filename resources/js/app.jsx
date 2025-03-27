import './bootstrap';
import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/MainDashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskList from './components/Tasks/TaskList';
import TaskCreate from './components/Tasks/TaskCreate';
import TaskEdit from './components/Tasks/TaskEdit';
import CategoryList from './components/Categories/CategoryList';
import CategoryCreate from './components/Categories/CategoryCreate';
import CategoryEdit from './components/Categories/CategoryEdit';

const ProtectedRoute = ({ element }) => {
    return localStorage.getItem('authToken') ? element : <Navigate to="/login" />;
};

const ProtectedLogin = ({ element }) => {
    return localStorage.getItem('authToken') ? <Navigate to="/dashboard" /> : element;
};

const App = () => {
    return (
        <BrowserRouter>
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
            </Routes>
        </BrowserRouter>
    );
};

const root = createRoot(document.getElementById('app'));
root.render(<App />);
