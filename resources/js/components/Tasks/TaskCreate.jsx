import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from '../Sidebar';

const TaskCreate = () => {
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categorySearch, setCategorySearch] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const dateInputRef = useRef(null);

    useEffect(() => {
        fetchCategories();

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/api/categories", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            const categoryData = response.data.data;
            setCategories(categoryData);
            setFilteredCategories(categoryData);
        } catch (err) {
            setError("Failed to load categories. Please try again later.");
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
        setCategoryId(exactMatch ? exactMatch.id : "");
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
        setError("");

        if (!title.trim() || !categoryId || !dueDate) {
            setError("Title, category, and due date are required.");
            return;
        }

        const taskData = { 
            title, 
            category_id: categoryId,
            due_date: dueDate 
        };
        console.log('Sending to backend:', taskData);

        try {
            await axios.post(
                "/api/tasks",
                taskData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );
            navigate("/tasks");
        } catch (err) {
            if (err.response?.status === 422) {
                const errorMessages = Object.values(err.response.data.errors)
                    .flat()
                    .join(" ");
                setError(errorMessages);
            } else {
                setError("Something went wrong. Please try again later.");
            }
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="flex">
            <Sidebar/>
            <div className="flex-1 mt-10 p-8 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-bold mb-4">Create Task</h2>
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Title *</label>
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
                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskCreate;