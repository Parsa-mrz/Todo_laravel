import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
    navigate('/categories/create');
  };

  const handleAddTask = () => {
    navigate('/tasks/create');
  };

  // Group tasks by status
  const groupedTasks = {
    pending: Array.isArray(tasks) ? tasks.filter(task => task.status.toLowerCase() === 'pending') : [],
    inProgress: Array.isArray(tasks) ? tasks.filter(task => task.status.toLowerCase() === 'in-progress') : [],
    complete: Array.isArray(tasks) ? tasks.filter(task => task.status.toLowerCase() === 'completed') : [],
  };

  // Function to format the date to YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to update the task status
  const handleTaskUpdate = async (taskId, newStatus) => {
    try {
      const response = await axios.put(
        `/api/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      console.log('Task updated:', response.data);
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      const taskId = result.draggableId;
      let newStatus = destination.droppableId;

      // Map the droppableId to the backend status
      switch (newStatus) {
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

      handleTaskUpdate(taskId, newStatus);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
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

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pending Tasks */}
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
                      groupedTasks.pending.slice(0, 3).map((task, index) => (
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
                              <p className="text-sm text-gray-500">Category: {task.category.name}</p>
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

            {/* In Progress Tasks */}
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
                      groupedTasks.inProgress.slice(0, 3).map((task, index) => (
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
                              <p className="text-sm text-gray-500">Category: {task.category.name}</p>
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

            {/* Completed Tasks */}
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
                      groupedTasks.complete.slice(0, 3).map((task, index) => (
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
                              <p className="text-sm text-gray-500">Category: {task.category.name}</p>
                            </li>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <p>No completed tasks.</p>
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