import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditInteraction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    clientId: '',
    type: 'Call',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInteraction();
    loadClients();
  }, [id]);

  const loadInteraction = async () => {
    try {
      const res = await axios.get(`/api/interactions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const interaction = res.data.interaction;
      setFormData({
        clientId: interaction.clientId,
        type: interaction.type,
        notes: interaction.notes || '',
        date: interaction.createdAt.split('T')[0]
      });
    } catch (err) {
      setError('Error loading interaction');
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

  const { clientId, type, notes, date } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await axios.put(`/api/interactions/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/interactions');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating interaction');
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
      <h1 className="text-2xl font-bold mb-6">Edit Interaction</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white p-6 rounded shadow">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client *
            </label>
            <select
              name="clientId"
              value={clientId}
              onChange={onChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select a client</option>
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
                Type *
              </label>
              <select
                name="type"
                value={type}
                onChange={onChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="Call">Call</option>
                <option value="Email">Email</option>
                <option value="Meeting">Meeting</option>
                <option value="Note">Note</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={date}
                onChange={onChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={notes}
              onChange={onChange}
              rows="4"
              className="w-full p-2 border rounded"
              placeholder="Add details about the interaction..."
            ></textarea>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Update Interaction'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/interactions')}
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