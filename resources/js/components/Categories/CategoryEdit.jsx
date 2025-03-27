import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from '../Sidebar';

const CategoryEdit = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchCategory();
    }, []);

    const fetchCategory = async () => {
        try {
            const response = await axios.get(`/api/categories/${id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
              });
            const categoryData = response.data.data; // Access the nested "data" object
            setName(categoryData.name);
        } catch (err) {
            console.error(err);
            setError('Failed to load category data.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `/api/categories/${id}`,
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                }
            );
            navigate("/categories");
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
            <Sidebar/>
            <div className="flex-1 p-8 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-bold mb-4">Edit Category</h2>
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Category Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
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
        </div>
    );
};

export default CategoryEdit;