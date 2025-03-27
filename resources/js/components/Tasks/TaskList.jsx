import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from '../Sidebar';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');

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
                setError('Something went wrong. Please try again later.');
            }
        }
    };

    return (
        <div className="flex">
            <Sidebar/>
            <div className="flex-1 p-8 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-bold mb-4">Tasks</h2>
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                        {error}
                    </div>
                )}
                <div className="flex justify-between">
                    <Link
                        to="/tasks/create"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 inline-block"
                    >
                        + Add Task
                    </Link>
                </div>
                <ul className="space-y-2">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className="flex justify-between items-center p-3 bg-gray-100 rounded-md"
                        >
                            <span>{task.title} - {task.category ? task.category.name : 'No Category'}</span>
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
                    ))}
                </ul>
            </div>
        </div>    
    );
};

export default TaskList;