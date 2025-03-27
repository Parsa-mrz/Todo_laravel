import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const tasksResponse = await axios.get('/api/tasks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

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

      const userResponse = await axios.get('/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (userResponse.data && userResponse.data.data && userResponse.data.data.email) {
        setUserEmail(userResponse.data.data.email);
      } else {
        console.error("Email not found in user data:", userResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const validationErrors = err.response.data.errors;
        const errorMessages = Object.values(validationErrors).join(' ');
        setError(errorMessages);
      } else {
        setError('Something went wrong while deleting the task. Please try again.');
      }
    }
  };

  const handleEdit = (taskId) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleAddCategory = () => {
    navigate('/categories/create');
  };

  const handleAddTask = () => {
    navigate('/tasks/create');
  };

  const groupedTasks = {
    pending: Array.isArray(tasks) ? tasks.filter(task => task.status.toLowerCase() === 'pending') : [],
    inProgress: Array.isArray(tasks) ? tasks.filter(task => task.status.toLowerCase() === 'in-progress') : [],
    complete: Array.isArray(tasks) ? tasks.filter(task => task.status.toLowerCase() === 'completed') : [],
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleTaskUpdate = async (taskId, newStatus) => {
    try {
      await axios.put(
        `/api/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      return true; // Indicate success
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status');
      return false; // Indicate failure
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return; // No change if dropped in the same place or outside a droppable
    }

    const taskId = parseInt(draggableId); // Convert string to integer since draggableId is a string
    let newStatus;

    switch (destination.droppableId) {
      case 'pending':
        newStatus = 'pending';
        break;
      case 'inProgress':
        newStatus = 'in-progress';
        break;
      case 'complete':
        newStatus = 'completed';
        break;
      default:
        return;
    }

    // Optimistically update the UI first
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Then make the API call
    const success = await handleTaskUpdate(taskId, newStatus);

    if (!success) {
      // Revert the change if the API call fails
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: groupedTasks[source.droppableId].find(t => t.id === taskId).status } : task
        )
      );
    }
  };

  return (
    <div className="flex">
      <div className="w-64 h-screen bg-gray-800 text-white p-6 space-y-6">
        <div className="text-2xl font-semibold">Dashboard</div>
        <div className="space-y-4">
          <p className="text-sm">Welcome, {userEmail}</p>
          <div>
            <button className="w-full text-left py-2 px-4 text-lg font-medium text-white hover:bg-gray-700 rounded-md transition duration-300 ease-in-out transform hover:scale-105" onClick={() => navigate('/tasks')}>
              Tasks
            </button>
          </div>
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

      <div className="flex-1 p-8 bg-gray-100">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            {error}
          </div>
        )}
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

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Droppable droppableId="pending">
              {(provided) => (
                <div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Pending Tasks</h3>
                  <ul>
                    {groupedTasks.pending.length > 0 ? (
                      groupedTasks.pending.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="border p-4 mb-4 rounded-lg shadow-sm hover:bg-yellow-50 transition duration-300"
                            >
                              <h4 className="text-lg font-semibold">{task.title}</h4>
                              <p className="text-sm text-gray-600">{task.description}</p>
                              <p className="text-sm text-gray-500">Due Date: {formatDate(task.due_date)}</p>
                              <p className="text-sm text-gray-500">Category: {task.category ? task.category.name : 'No Category'}</p>
                              <div className="flex justify-end space-x-4 mt-2">
                                <button 
                                  onClick={() => handleEdit(task.id)}
                                  className="text-blue-500 hover:underline"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDelete(task.id)}
                                  className="text-red-500 hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <p>No pending tasks available.</p>
                    )}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>

            <Droppable droppableId="inProgress">
              {(provided) => (
                <div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">In Progress Tasks</h3>
                  <ul>
                    {groupedTasks.inProgress.length > 0 ? (
                      groupedTasks.inProgress.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="border p-4 mb-4 rounded-lg shadow-sm hover:bg-blue-50 transition duration-300"
                            >
                              <h4 className="text-lg font-semibold">{task.title}</h4>
                              <p className="text-sm text-gray-600">{task.description}</p>
                              <p className="text-sm text-gray-500">Due Date: {formatDate(task.due_date)}</p>
                              <p className="text-sm text-gray-500">Category: {task.category ? task.category.name : 'No Category'}</p>
                              <div className="flex justify-end space-x-4 mt-2">
                                <button 
                                  onClick={() => handleEdit(task.id)}
                                  className="text-blue-500 hover:underline"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDelete(task.id)}
                                  className="text-red-500 hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <p>No tasks in progress.</p>
                    )}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>

            <Droppable droppableId="complete">
              {(provided) => (
                <div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Completed Tasks</h3>
                  <ul>
                    {groupedTasks.complete.length > 0 ? (
                      groupedTasks.complete.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="border p-4 mb-4 rounded-lg shadow-sm hover:bg-green-50 transition duration-300"
                            >
                              <h4 className="text-lg font-semibold">{task.title}</h4>
                              <p className="text-sm text-gray-600">{task.description}</p>
                              <p className="text-sm text-gray-500">Due Date: {formatDate(task.due_date)}</p>
                              <p className="text-sm text-gray-500">Category: {task.category ? task.category.name : 'No Category'}</p>
                              <div className="flex justify-end space-x-4 mt-2">
                                <button 
                                  onClick={() => handleEdit(task.id)}
                                  className="text-blue-500 hover:underline"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDelete(task.id)}
                                  className="text-red-500 hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <p>No completed tasks available.</p>
                    )}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Dashboard;