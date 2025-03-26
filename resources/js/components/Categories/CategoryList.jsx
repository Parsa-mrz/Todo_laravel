import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');

    useEffect(() => {
        axios.get('/sanctum/csrf-cookie').then(() => {
            fetchCategories();
        });
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/categories', { name });
            setName('');
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/categories/${id}`);
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Categories</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row">
                    <div className="col-md-8">
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Category name"
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <button type="submit" className="btn btn-primary">Add</button>
                    </div>
                </div>
            </form>
            <ul className="list-group">
                {categories.map(category => (
                    <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {category.name}
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(category.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;