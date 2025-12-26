import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format, isPast, isToday } from 'date-fns';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTasks();
    loadClients();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTasks(res.data.tasks);
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const res = await axios.get('/api/clients', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setClients(res.data.clients);
    } catch (err) {
      console.error('Error loading clients:', err);
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      loadTasks(); // Refresh the list
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Error updating task');
    }
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filter);

  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  const getTaskPriority = (task) => {
    if (task.status === 'COMPLETED') return 'normal';
    if (!task.dueDate) return 'normal';
    
    const dueDate = new Date(task.dueDate);
    if (isPast(dueDate) && !isToday(dueDate)) return 'overdue';
    if (isToday(dueDate)) return 'today';
    return 'normal';
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'overdue':
        return 'bg-red-50 border-red-200';
      case 'today':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-white';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'overdue':
        return 'Overdue';
      case 'today':
        return 'Due Today';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link 
          to="/tasks/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-bold mt-2 text-red-500">{pendingTasks.length}</div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">In Progress</div>
          <div className="text-2xl font-bold mt-2 text-yellow-500">{inProgressTasks.length}</div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-2xl font-bold mt-2 text-green-500">{completedTasks.length}</div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'PENDING' 
                ? 'bg-red-600 text-white' 
                : 'bg-red-100 hover:bg-red-200 text-red-800'
            }`}
          >
            Pending
          </button>
          
          <button
            onClick={() => setFilter('IN_PROGRESS')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'IN_PROGRESS' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
            }`}
          >
            In Progress
          </button>
          
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'COMPLETED' 
                ? 'bg-green-600 text-white' 
                : 'bg-green-100 hover:bg-green-200 text-green-800'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        {filteredTasks.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Task</th>
                <th className="p-2 text-left">Client</th>
                <th className="p-2 text-left">Due Date</th>
                <th className="p-2 text-left">Priority</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => {
                const priority = getTaskPriority(task);
                return (
                  <tr 
                    key={task.id} 
                    className={`border-b hover:bg-gray-50 ${getPriorityClass(priority)}`}
                  >
                    <td className="p-2">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                    </td>
                    <td className="p-2">
                      <Link 
                        to={`/clients/${task.clientId}`} 
                        className="text-blue-600 hover:underline"
                      >
                        {task.clientId ? getClientName(task.clientId) : '-'}
                      </Link>
                    </td>
                    <td className="p-2">
                      {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy h:mm a') : '-'}
                    </td>
                    <td className="p-2">
                      {getPriorityText(priority) && (
                        <span className={`px-2 py-1 rounded text-xs ${
                          priority === 'overdue' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {getPriorityText(priority)}
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        className={`px-2 py-1 rounded text-sm ${
                          task.status === 'PENDING' 
                            ? 'bg-red-100 text-red-800' 
                            : task.status === 'IN_PROGRESS' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <Link 
                        to={`/tasks/${task.id}/edit`} 
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No tasks found
          </div>
        )}
      </div>
    </div>
  );
}