import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    clients: 0,
    interactions: 0,
    tasks: 0,
    pendingTasks: 0
  });
  const [recentClients, setRecentClients] = useState([]);
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
        pendingTasks: tasks.filter(task => task.status === 'PENDING').length
      });

      setRecentClients(clients.slice(0, 5));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
        
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Pending Tasks</div>
          <div className="text-2xl font-bold mt-2 text-red-500">{stats.pendingTasks}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">Recent Clients</h2>
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
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded">
              Add New Client
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded">
              Log Interaction
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded">
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}