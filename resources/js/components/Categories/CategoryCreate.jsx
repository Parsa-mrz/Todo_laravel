import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CategoryCreate = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "/api/categories",
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );
            navigate("/categories");
        } catch (err) {
            if (err.response?.status === 422) {
                const validationErrors = err.response.data.errors;
                const errorMessages = Object.values(validationErrors).join(" ");
                setError(errorMessages);
            } else {
                setError("Something went wrong. Please try again later.");
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Create Category</h2>
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Category Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="flex space-x-3">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/categories")}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryCreate;