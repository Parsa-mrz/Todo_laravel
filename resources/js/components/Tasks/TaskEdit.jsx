import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';

const TaskEdit = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categorySearch, setCategorySearch] = useState('');
    const [status, setStatus] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const dateInputRef = useRef(null);

    useEffect(() => {
        fetchTask();
        fetchCategories();

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchTask = async () => {
        try {
            const response = await axios.get(`/api/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            const taskData = response.data.data;
            setTitle(taskData.title);
            setCategoryId(taskData.category ? taskData.category.id : '');
            setCategorySearch(taskData.category ? taskData.category.name : '');
            setStatus(taskData.status || 'pending');
            
            const datePart = taskData.due_date ? taskData.due_date.split(' ')[0] : '';
            setDueDate(datePart);
        } catch (err) {
            console.error(err);
            setError('Failed to load task data.');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            const categoryData = response.data.data || [];
            setCategories(categoryData);
            setFilteredCategories(categoryData);
        } catch (err) {
            console.error(err);
            setError('Failed to load categories.');
        }
    };

    const handleSearchChange = (e) => {
        const searchValue = e.target.value;
        setCategorySearch(searchValue);
        setShowDropdown(true);

        const filtered = categories.filter((category) =>
            category.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredCategories(filtered);

        const exactMatch = categories.find(
            (category) => category.name.toLowerCase() === searchValue.toLowerCase()
        );
        setCategoryId(exactMatch ? exactMatch.id : '');
    };

    const handleCategorySelect = (category) => {
        setCategoryId(category.id);
        setCategorySearch(category.name);
        setShowDropdown(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };

    const handleDateClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!title.trim() || !categoryId || !dueDate) {
                setError("Title, category, and due date are required.");
                return;
            }

            const taskData = { 
                title, 
                category_id: categoryId, 
                status,
                due_date: dueDate
            };
            console.log('Updating task with:', taskData);

            await axios.put(
                `/api/tasks/${id}`,
                taskData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                }
            );
            navigate('/tasks');
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const validationErrors = err.response.data.errors;
                const errorMessages = Object.values(validationErrors).join(' ');
                setError(errorMessages);
            } else {
                setError('Something went wrong. Please try again later.');
            }
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Task</h2>
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Task Title *</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 relative" ref={dropdownRef}>
                        <label className="block text-gray-700 mb-2">Category *</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            value={categorySearch}
                            onChange={handleSearchChange}
                            onFocus={() => setShowDropdown(true)}
                            placeholder="Search or select a category"
                            required
                        />
                        {showDropdown && filteredCategories.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                                {filteredCategories.map((category) => (
                                    <li
                                        key={category.id}
                                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                        onClick={() => handleCategorySelect(category)}
                                    >
                                        {category.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {showDropdown && filteredCategories.length === 0 && categorySearch && (
                            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 p-2 text-gray-500">
                                No matching categories found.
                            </div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Due Date *</label>
                        <input
                            ref={dateInputRef}
                            type="date"
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            onClick={handleDateClick}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex space-x-4">
                        <button 
                            type="submit" 
                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskEdit;