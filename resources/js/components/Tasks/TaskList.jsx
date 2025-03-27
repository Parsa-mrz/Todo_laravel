import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

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
            console.error(err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Tasks</h2>
            <div className="flex justify-between">
                <Link
                    to="/tasks/create"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 inline-block"
                >
                    + Add Task
                </Link>
                <Link
                    to="/dashboard"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 inline-block"
                >
                    Dashboard
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
    );
};

export default TaskList;