import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from '../Sidebar';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // Filter by status

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get("/api/tasks", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            setTasks(response.data.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch tasks');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            fetchTasks();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const validationErrors = err.response.data.errors;
                const errorMessages = Object.values(validationErrors).join(' ');
                setError(errorMessages);
            } else {
                setError('Something went wrong while deleting the task.');
            }
        }
    };

    // Function to determine status styling
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', text: 'Pending' };
            case 'in-progress':
                return { bgColor: 'bg-blue-100', textColor: 'text-blue-800', text: 'In Progress' };
            case 'completed':
                return { bgColor: 'bg-green-100', textColor: 'text-green-800', text: 'Completed' };
            default:
                return { bgColor: 'bg-gray-100', textColor: 'text-gray-800', text: 'Unknown' };
        }
    };

    // Filter and search tasks
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (task.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Tasks</h2>
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                        {error}
                    </div>
                )}

                {/* Search and Filter Controls */}
                <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center w-full md:w-1/2">
                        <input
                            type="text"
                            placeholder="Search tasks by title or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <Link
                            to="/tasks/create"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            + Add Task
                        </Link>
                    </div>
                </div>

                {/* Task List */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {filteredTasks.length > 0 ? (
                        <ul className="space-y-2">
                            {filteredTasks.map((task) => {
                                const { bgColor, textColor, text } = getStatusStyle(task.status);
                                return (
                                    <li
                                        key={task.id}
                                        className="flex justify-between items-center p-3 bg-gray-100 rounded-md"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span>{task.title} - {task.category ? task.category.name : 'No Category'}</span>
                                            <span className={`${bgColor} ${textColor} px-2 py-1 rounded-full text-sm`}>
                                                {text}
                                            </span>
                                        </div>
                                        <div>
                                            <Link
                                                to={`/tasks/edit/${task.id}`}
                                                className="text-blue-500 hover:underline mr-4"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="text-red-500 hover:underline"
                                                onClick={() => handleDelete(task.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No tasks match your search or filter criteria.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskList;