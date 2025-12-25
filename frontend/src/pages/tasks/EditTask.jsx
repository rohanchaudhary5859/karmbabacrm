import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    dueDate: '',
    status: 'PENDING'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTask();
    loadClients();
  }, [id]);

  const loadTask = async () => {
    try {
      const res = await axios.get(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const task = res.data.task;
      setFormData({
        title: task.title,
        description: task.description || '',
        clientId: task.clientId || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        status: task.status
      });
    } catch (err) {
      setError('Error loading task');
      console.error(err);
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

  const { title, description, clientId, dueDate, status } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await axios.put(`/api/tasks/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating task');
    } finally {
      setSubmitting(false);
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
      <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white p-6 rounded shadow">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Task title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              rows="3"
              className="w-full p-2 border rounded"
              placeholder="Task description"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              name="clientId"
              value={clientId}
              onChange={onChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a client (optional)</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company ? `(${client.company})` : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={dueDate}
                onChange={onChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={status}
                onChange={onChange}
                className="w-full p-2 border rounded"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Update Task'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}