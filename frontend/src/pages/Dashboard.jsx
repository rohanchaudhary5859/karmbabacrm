import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import SparklineChart from '../components/SparklineChart';
import LineChart from '../components/LineChart';
import DoughnutChart from '../components/DoughnutChart';

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
        axios.get('/api/clients'),
        axios.get('/api/interactions'),
        axios.get('/api/tasks')
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Welcome back, {user?.name || 'User'}</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your CRM today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Clients</div>
            <div className="text-xl font-semibold">{stats.clients}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Open Tasks</div>
            <div className="text-xl font-semibold">{stats.pendingTasks + stats.inProgressTasks}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-xl font-semibold text-green-600">{stats.completedTasks}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Leads & Activity</h2>
            <div className="text-sm text-gray-500">Last 30 days</div>
          </div>
          <div className="h-64">
            <LineChart
              labels={[...Array(10)].map((_, i) => `Day ${i + 1}`)}
              series={[8, 12, 10, 14, 18, 15, 20, 22, 19, 24]}
              label="Leads"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-gradient-to-br from-white to-gray-50 rounded">
              <div className="text-sm text-gray-500">New Leads</div>
              <div className="text-2xl font-bold">{Math.max(12, stats.clients)}</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-white to-gray-50 rounded">
              <div className="text-sm text-gray-500">Conversions</div>
              <div className="text-2xl font-bold text-green-600">{Math.round((stats.completedTasks / Math.max(1, stats.tasks)) * 100)}%</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-white to-gray-50 rounded">
              <div className="text-sm text-gray-500">Response Time</div>
              <div className="text-2xl font-bold">{Math.floor(Math.random() * 48) + ' hrs'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-3">Task Status</h3>
          <div className="h-44">
            <DoughnutChart data={{ labels: ['Completed','In Progress','Pending'], values: [stats.completedTasks, stats.inProgressTasks, stats.pendingTasks], colors: ['#10b981', '#f59e0b', '#ef4444'] }} />
          </div>
          <div className="mt-4">
            <SparklineChart data={[2,4,3,6,7,5,8,6,7,9]} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Clients</h2>
            <Link to="/clients" className="text-blue-600 text-sm hover:underline">View All</Link>
          </div>
          {recentClients.length > 0 ? (
            <ul className="divide-y">
              {recentClients.map(c => (
                <li key={c.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-gray-500">{c.company || '-'}</div>
                  </div>
                  <div className="text-sm text-gray-500">{c.email}</div>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500">No clients yet</p>}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Interactions</h2>
            <Link to="/interactions" className="text-blue-600 text-sm hover:underline">View All</Link>
          </div>
          {recentInteractions.length > 0 ? (
            <ul className="space-y-3">
              {recentInteractions.map(i => (
                <li key={i.id} className="border p-3 rounded">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{i.client?.name}</div>
                    <div className="text-sm text-gray-500">{new Date(i.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">{i.notes}</div>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500">No interactions yet</p>}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Tasks</h2>
          <Link to="/tasks" className="text-blue-600 text-sm hover:underline">View All</Link>
        </div>
        {recentTasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
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
                    <td className="p-2">{task.client ? task.client.name : '-'}</td>
                    <td className="p-2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>{task.status.replace('_',' ')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-gray-500">No tasks yet</p>}
      </div>
    </div>
  );
}