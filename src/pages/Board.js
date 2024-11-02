import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import '../styles/Board.css';
import moment from 'moment';

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('week');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    backlog: false,
    todo: false,
    inProgress: false,
    done: false
  });

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  //fetch user from local storage and set it to the state
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      console.log(user);
      setUser(user);
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(`/tasks?filter=${filter}`);
      setTasks(response.data);
    } catch (error) {
      toast.error('Error fetching tasks');
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const response = await axiosInstance.post('/tasks', taskData);
      setTasks([...tasks, response.data]);
      setIsAddModalOpen(false);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Error deleting task');
    }
  };
 
  //edit task by opening the modal and passing the task data
  const handleEditTask = (task) => {
    setIsAddModalOpen(true);
    console.log(task);
    // setTaskToEdit(task);
  };

  //share task by copying the task link to the clipboard
  const handleShareTask = (task) => {
    navigator.clipboard.writeText(window.location.href + '/tasks/' + task._id);
    toast.success('Task link copied to clipboard');
  };


  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await axiosInstance.patch(`/tasks/${taskId}/status`, {
        status: newStatus
      });
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
    } catch (error) {
      toast.error('Error updating task status');
    }
  };

  const getFilteredTasks = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="board-container">
       <div className="board-header">
        <h1>Welcome {user?.name.split(' ')[0]}</h1>
        <div className="board-controls">
          {
        //format current date with moment.js
        moment().format(' Do MMM YYYY')


          }
        </div>
      </div>
      <div className="board-header">
        <h1>Board</h1>
        <div className="board-controls">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="board-columns">
        {/* Backlog Column */}
        <div className="board-column">
          <div className="column-header">
            <h2>Backlog</h2>
            <button 
              className="collapse-button"
              onClick={() => toggleSection('backlog')}
            >
              {collapsedSections.backlog ? '▼' : '▲'}
            </button>
          </div>
          {!collapsedSections.backlog && (
            <div className="tasks-container">
              {getFilteredTasks('BACKLOG').map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEditTask}
                  onShare={handleShareTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* To Do Column */}
        <div className="board-column">
          <div className="column-header">
            <h2>To Do</h2>
            <div className="column-header-controls">
              <button 
                className="collapse-button"
                onClick={() => toggleSection('todo')}
              >
                {collapsedSections.todo ? '▼' : '▲'}
              </button>
              <button 
                className="add-task-button"
                onClick={() => setIsAddModalOpen(true)}
              >
                +
              </button>
            </div>
          </div>
          {!collapsedSections.todo && (
            <div className="tasks-container">
              {getFilteredTasks('TODO').map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEditTask}
                  onShare={handleShareTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* In Progress Column */}
        <div className="board-column">
          <div className="column-header">
            <h2>In Progress</h2>
            <button 
              className="collapse-button"
              onClick={() => toggleSection('inProgress')}
            >
              {collapsedSections.inProgress ? '▼' : '▲'}
            </button>
          </div>
          {!collapsedSections.inProgress && (
            <div className="tasks-container">
              {getFilteredTasks('IN_PROGRESS').map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEditTask}
                  onShare={handleShareTask}
                  onDelete={handleDeleteTask}

                />
              ))}
            </div>
          )}
        </div>

        {/* Done Column */}
        <div className="board-column">
          <div className="column-header">
            <h2>Done</h2>
            <button 
              className="collapse-button"
              onClick={() => toggleSection('done')}
            >
              {collapsedSections.done ? '▼' : '▲'}
            </button>
          </div>
          {!collapsedSections.done && (
            <div className="tasks-container">
              {getFilteredTasks('DONE').map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEditTask}
                  onShare={handleShareTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <AddTaskModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddTask}
        />
      )}
    </div>
  );
};

export default Board;