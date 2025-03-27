import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/api/categories", {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
              });
            setCategories(response.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/categories/${id}`,{
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
              });
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="flex justify-between">
            <Link
                to="/categories/create"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 inline-block"
            >
                + Add Category
            </Link>

            <Link
                to="/dashboard"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 inline-block"
            >
                Dashboard
            </Link>
            </div>
            <ul className="space-y-2">
                {categories.map((category) => (
                    <li
                        key={category.id}
                        className="flex justify-between items-center p-3 bg-gray-100 rounded-md"
                    >
                        <span>{category.name}</span>
                        <div>
                            <Link
                                to={`/categories/edit/${category.id}`}
                                className="text-blue-500 hover:underline mr-4"
                            >
                                Edit
                            </Link>
                            <button
                                className="text-red-500 hover:underline"
                                onClick={() => handleDelete(category.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;