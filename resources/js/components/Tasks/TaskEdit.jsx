import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const TaskEdit = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTask();
        fetchCategories();
    }, []);

    const fetchTask = async () => {
        try {
            const response = await axios.get(`/api/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            const taskData = response.data.data; // Access the nested "data" object
            setTitle(taskData.title);
            setCategoryId(taskData.category ? taskData.category.id : ''); // Handle case where category might be null
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
            setCategories(response.data.data || []); // Ensure it's an array, fallback to empty array if undefined
        } catch (err) {
            console.error(err);
            setError('Failed to load categories.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `/api/tasks/${id}`,
                { title, category_id: categoryId },
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
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Task Title</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Category</label>
                    <select
                        className="w-full px-4 py-2 border rounded-md"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex space-x-4">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskEdit;