import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddTask() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    dueDate: '',
    dueTime: '09:00',
    status: 'PENDING',
    addToCalendar: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

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

  const { title, description, clientId, dueDate, dueTime, status, addToCalendar } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Create task first
      const taskData = {
        title,
        description,
        clientId: clientId || undefined,
        dueDate: dueDate ? `${dueDate}T${dueTime}:00.000Z` : undefined,
        status
      };
      
      const taskRes = await axios.post('/api/tasks', taskData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // If user wants to add to calendar and has calendar integration
      if (addToCalendar && dueDate) {
        try {
          // In a real app, this would integrate with Google Calendar
          console.log('Would add to calendar:', {
            title,
            description,
            dueDate,
            dueTime
          });
        } catch (calendarErr) {
          console.error('Calendar integration error:', calendarErr);
          // Don't fail the task creation if calendar fails
        }
      }
      
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Task</h1>
      
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
                Due Time
              </label>
              <input
                type="time"
                name="dueTime"
                value={dueTime}
                onChange={onChange}
                className="w-full p-2 border rounded"
              />
            </div>
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
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="addToCalendar"
              checked={addToCalendar}
              onChange={onCheckboxChange}
              className="h-4 w-4 text-blue-600"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Add to Calendar
            </label>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Task'}
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