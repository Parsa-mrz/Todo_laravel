import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const tasksResponse = await axios.get('/api/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        //todo: remove the console.log statement
        console.log("Tasks Response: ", tasksResponse.data); // Log the API response to inspect

        if (tasksResponse.data && Array.isArray(tasksResponse.data.data)) {
          setTasks(tasksResponse.data.data);
        } else {
          console.error("Tasks data is not an array:", tasksResponse.data);
        }

        const categoriesResponse = await axios.get('/api/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setCategories(categoriesResponse.data);

        // Fetch user email
        //todo: fetch user email from the API
        const userResponse = await axios.get('/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setUserEmail(userResponse.data.email);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleAddCategory = () => {
    navigate('/add-category');
  };

  const handleAddTask = () => {
    navigate('/add-task');
  };

  // Group tasks by status
  const groupedTasks = {
    pending: Array.isArray(tasks) ? tasks.filter(task => task.status.toLowerCase() === 'pending') : [],
    inProgress: Array.isArray(tasks) ? tasks.filter(task => task.status.toLowerCase() === 'in-progress') : [],
    complete: Array.isArray(tasks) ? tasks.filter(task => task.status.toLowerCase() === 'completed') : [],
  };

  //todo: remove the console.log statement
  console.log("Grouped Tasks: ", groupedTasks); // Log grouped tasks

  // Function to format the date to YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-gray-800 text-white p-6 space-y-6">
        <div className="text-2xl font-semibold">Dashboard</div>
        <div className="space-y-4">
          <p className="text-sm">Welcome, {userEmail}</p>

          {/* Task Menu */}
          <div>
            <button className="w-full text-left py-2 px-4 text-lg font-medium text-white hover:bg-gray-700 rounded-md transition duration-300 ease-in-out transform hover:scale-105" onClick={() => navigate('/tasks')}>
              Tasks
            </button>
          </div>

          {/* Categories Menu */}
          <div>
            <button className="w-full text-left py-2 px-4 text-lg font-medium text-white hover:bg-gray-700 rounded-md transition duration-300 ease-in-out transform hover:scale-105" onClick={() => navigate('/categories')}>
              Categories
            </button>
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <div className="space-x-4">
            <button
              onClick={handleAddCategory}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add New Category
            </button>
            <button
              onClick={handleAddTask}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add New Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pending Tasks */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Pending Tasks</h3>
            <ul>
              {groupedTasks.pending.length > 0 ? (
                groupedTasks.pending.map((task) => (
                  <li
                    key={task.id}
                    className="border p-4 mb-4 rounded-lg shadow-sm hover:bg-yellow-50 transition duration-300"
                  >
                    <h4 className="text-lg font-semibold">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-sm text-gray-500">Due Date: {formatDate(task.due_date)}</p>
                    <p className="text-sm text-gray-500">Category: {task.category.name}</p>
                  </li>
                ))
              ) : (
                <p>No pending tasks available.</p>
              )}
            </ul>
          </div>

          {/* In Progress Tasks */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">In Progress Tasks</h3>
            <ul>
              {groupedTasks.inProgress.length > 0 ? (
                groupedTasks.inProgress.map((task) => (
                  <li
                    key={task.id}
                    className="border p-4 mb-4 rounded-lg shadow-sm hover:bg-blue-50 transition duration-300"
                  >
                    <h4 className="text-lg font-semibold">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-sm text-gray-500">Due Date: {formatDate(task.due_date)}</p>
                    <p className="text-sm text-gray-500">Category: {task.category.name}</p>
                  </li>
                ))
              ) : (
                <p>No tasks in progress.</p>
              )}
            </ul>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Completed Tasks</h3>
            <ul>
              {groupedTasks.complete.length > 0 ? (
                groupedTasks.complete.map((task) => (
                  <li
                    key={task.id}
                    className="border p-4 mb-4 rounded-lg shadow-sm hover:bg-green-50 transition duration-300"
                  >
                    <h4 className="text-lg font-semibold">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-sm text-gray-500">Due Date: {formatDate(task.due_date)}</p>
                    <p className="text-sm text-gray-500">Category: {task.category.name}</p>
                  </li>
                ))
              ) : (
                <p>No completed tasks.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;