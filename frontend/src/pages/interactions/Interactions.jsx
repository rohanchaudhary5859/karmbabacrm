import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Interactions() {
  const [interactions, setInteractions] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadInteractions();
    loadClients();
  }, []);

  const loadInteractions = async () => {
    try {
      const res = await axios.get('/api/interactions', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setInteractions(res.data.interactions);
    } catch (err) {
      console.error('Error loading interactions:', err);
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

  const filteredInteractions = filter === 'all' 
    ? interactions 
    : interactions.filter(i => i.type === filter);

  const interactionTypes = [...new Set(interactions.map(i => i.type))];

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
        <h1 className="text-2xl font-bold">Interactions</h1>
        <Link 
          to="/interactions/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Interaction
        </Link>
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
          
          {interactionTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded text-sm ${
                filter === type 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        {filteredInteractions.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Client</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Notes</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInteractions.map(interaction => (
                <tr key={interaction.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    {new Date(interaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <Link 
                      to={`/clients/${interaction.clientId}`} 
                      className="text-blue-600 hover:underline"
                    >
                      {getClientName(interaction.clientId)}
                    </Link>
                  </td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {interaction.type}
                    </span>
                  </td>
                  <td className="p-2 max-w-xs truncate">{interaction.notes}</td>
                  <td className="p-2">
                    <Link 
                      to={`/interactions/${interaction.id}/edit`} 
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No interactions found
          </div>
        )}
      </div>
    </div>
  );
}