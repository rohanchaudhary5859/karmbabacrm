import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Segments() {
  const [segments, setSegments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSegments();
    loadClients();
  }, []);

  const loadSegments = async () => {
    try {
      const res = await axios.get('/api/segments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSegments(res.data.segments);
    } catch (err) {
      setError('Error loading segments');
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this segment?')) {
      try {
        await axios.delete(`/api/segments/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        loadSegments();
      } catch (err) {
        alert('Error deleting segment');
        console.error(err);
      }
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
        <h1 className="text-2xl font-bold">Client Segments</h1>
        <button 
          onClick={() => document.getElementById('create-segment-modal').showModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Segment
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segments.map(segment => (
          <div key={segment.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{segment.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{segment.description}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    // Set segment data in modal
                    document.getElementById('edit-segment-modal').showModal();
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(segment.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Clients</span>
                <span className="font-medium">{segment.clients.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${segments.length ? (segment.clients.length / clients.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1">
              {segment.clients.slice(0, 3).map(client => (
                <span key={client.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {client.name}
                </span>
              ))}
              {segment.clients.length > 3 && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  +{segment.clients.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
        
        {segments.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No segments created yet</p>
            <button 
              onClick={() => document.getElementById('create-segment-modal').showModal()}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Your First Segment
            </button>
          </div>
        )}
      </div>
      
      {/* Create Segment Modal */}
      <dialog id="create-segment-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create New Segment</h3>
          <form method="dialog" className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segment Name *
              </label>
              <input
                type="text"
                placeholder="e.g., High Value Clients"
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Describe this segment..."
                rows="3"
                className="w-full p-2 border rounded"
              ></textarea>
            </div>
            
            <div className="modal-action">
              <button 
                type="button" 
                className="btn"
                onClick={() => document.getElementById('create-segment-modal').close()}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Create Segment
              </button>
            </div>
          </form>
        </div>
      </dialog>
      
      {/* Edit Segment Modal */}
      <dialog id="edit-segment-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Segment</h3>
          <form method="dialog" className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segment Name *
              </label>
              <input
                type="text"
                placeholder="e.g., High Value Clients"
                className="w-full p-2 border rounded"
                defaultValue="High Value Clients"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Describe this segment..."
                rows="3"
                className="w-full p-2 border rounded"
                defaultValue="Clients with high purchase value and frequent interactions"
              ></textarea>
            </div>
            
            <div className="modal-action">
              <button 
                type="button" 
                className="btn"
                onClick={() => document.getElementById('edit-segment-modal').close()}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Update Segment
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}