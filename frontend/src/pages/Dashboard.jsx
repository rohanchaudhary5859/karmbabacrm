import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    clients: 0,
    interactions: 0,
    tasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0
  });
  const [recentClients, setRecentClients] = useState([]);
  const [recentInteractions, setRecentInteractions] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [clientsRes, interactionsRes, tasksRes] = await Promise.all([
        axios.get('/api/clients', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/interactions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const clients = clientsRes.data.clients;
      const interactions = interactionsRes.data.interactions;
      const tasks = tasksRes.data.tasks;

      setStats({
        clients: clients.length,
        interactions: interactions.length,
        tasks: tasks.length,
        pendingTasks: tasks.filter(task => task.status === 'PENDING').length,
        inProgressTasks: tasks.filter(task => task.status === 'IN_PROGRESS').length,
        completedTasks: tasks.filter(task => task.status === 'COMPLETED').length
      });

      setRecentClients(clients.slice(0, 5));
      setRecentInteractions(interactions.slice(0, 5));
      setRecentTasks(tasks.slice(0, 5));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Clients</div>
          <div className="text-2xl font-bold mt-2">{stats.clients}</div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Interactions</div>
          <div className="text-2xl font-bold mt-2">{stats.interactions}</div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Tasks</div>
          <div className="text-2xl font-bold mt-2">{stats.tasks}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">Task Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Pending</span>
                <span className="text-sm font-medium text-red-500">{stats.pendingTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${stats.tasks ? (stats.pendingTasks / stats.tasks) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">In Progress</span>
                <span className="text-sm font-medium text-yellow-500">{stats.inProgressTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${stats.tasks ? (stats.inProgressTasks / stats.tasks) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-sm font-medium text-green-500">{stats.completedTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${stats.tasks ? (stats.completedTasks / stats.tasks) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow lg:col-span-2">
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/clients/new" 
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded text-center transition-colors"
            >
              <div className="text-blue-600 font-medium">Add Client</div>
              <div className="text-sm text-gray-500 mt-1">Create new client</div>
            </Link>
            
            <Link 
              to="/interactions/new" 
              className="bg-green-50 hover:bg-green-100 p-4 rounded text-center transition-colors"
            >
              <div className="text-green-600 font-medium">Log Interaction</div>
              <div className="text-sm text-gray-500 mt-1">Record client contact</div>
            </Link>
            
            <Link 
              to="/tasks/new" 
              className="bg-purple-50 hover:bg-purple-100 p-4 rounded text-center transition-colors"
            >
              <div className="text-purple-600 font-medium">Create Task</div>
              <div className="text-sm text-gray-500 mt-1">Add new task</div>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Recent Clients</h2>
            <Link to="/clients" className="text-blue-600 text-sm hover:underline">
              View All
            </Link>
          </div>
          
          {recentClients.length > 0 ? (
            <ul className="space-y-3">
              {recentClients.map(client => (
                <li key={client.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-gray-600">{client.company}</div>
                  <div className="text-sm text-gray-500">{client.email}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No clients yet</p>
          )}
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Recent Interactions</h2>
            <Link to="/interactions" className="text-blue-600 text-sm hover:underline">
              View All
            </Link>
          </div>
          
          {recentInteractions.length > 0 ? (
            <ul className="space-y-3">
              {recentInteractions.map(interaction => (
                <li key={interaction.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <div className="font-medium">{interaction.client.name}</div>
                    <span className="text-sm text-gray-500">
                      {new Date(interaction.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {interaction.type}
                    </span>
                    <span className="text-sm text-gray-600 truncate max-w-[60%]">
                      {interaction.notes}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No interactions yet</p>
          )}
        </div>
      </div>
      
      <div className="mt-6 bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Recent Tasks</h2>
          <Link to="/tasks" className="text-blue-600 text-sm hover:underline">
            View All
          </Link>
        </div>
        
        {recentTasks.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Task</th>
                <th className="p-2 text-left">Client</th>
                <th className="p-2 text-left">Due Date</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map(task => (
                <tr key={task.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-gray-500">{task.description}</div>
                  </td>
                  <td className="p-2">
                    {task.client ? task.client.name : '-'}
                  </td>
                  <td className="p-2">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No tasks yet</p>
        )}
      </div>
    </div>
  );
}