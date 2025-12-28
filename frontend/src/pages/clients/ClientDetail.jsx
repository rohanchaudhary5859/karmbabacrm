import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClientData();
  }, [id]);

  const loadClientData = async () => {
    try {
      const [clientRes, interactionsRes] = await Promise.all([
        axios.get(`/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`/api/interactions/client/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      setClient(clientRes.data.client);
      setInteractions(interactionsRes.data.interactions);
    } catch (err) {
      setError('Error loading client data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await axios.delete(`/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        navigate('/clients');
      } catch (err) {
        alert('Error deleting client');
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

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded">
        {error}
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-8">
        <p>Client not found</p>
        <Link to="/clients" className="text-blue-600 hover:underline">
          Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{client.name}</h1>
        <div className="space-x-2">
          <Link 
            to={`/clients/${id}/edit`} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <button 
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={async () => {
              try {
                // call AI lead score proxy
                const payload = {
                  monthly_qty: client.monthlyQty || 0,
                  price_fit: client.priceFit || 0,
                  certifications: client.certifications || 0,
                  urgency_days: client.urgencyDays || 30
                };
                const resp = await axios.post('/api/ai/lead-score', payload, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                if (resp.data && resp.data.ok) {
                  const { score, recommendation } = resp.data.data;
                  alert(`Lead Score: ${score}\nRecommendation: ${recommendation}`);
                } else {
                  alert('AI scoring unavailable');
                }
              } catch (err) {
                console.error(err);
                alert('Error scoring lead');
              }
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Score Lead
          </button>
          <button
            onClick={async () => {
              if (!client.phone) { alert('Client has no phone number'); return; }
              try {
                const message = `Hi ${client.name}, we have an update for you. Reply to connect.`;
                const r = await axios.post('/api/whatsapp/send', { to: client.phone, message }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                if (r.data && r.data.success) alert('WhatsApp message queued');
                else alert('WhatsApp send failed');
              } catch (err) {
                console.error(err);
                alert('Error sending WhatsApp');
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Send WhatsApp
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="font-medium">{client.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Company</label>
              <p className="font-medium">{client.company || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{client.email || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="font-medium">{client.phone || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Address</label>
              <p className="font-medium">{client.address || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Website</label>
              <p className="font-medium">{client.website || '-'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">Client Summary</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-500">Interactions</label>
              <p className="font-medium">{interactions.length}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Last Contact</label>
              <p className="font-medium">
                {interactions.length > 0 
                  ? new Date(interactions[0].createdAt).toLocaleDateString() 
                  : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Recent Interactions</h2>
          <Link 
            to={`/interactions/new?client=${id}`} 
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            Add Interaction
          </Link>
        </div>
        
        {interactions.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {interactions.slice(0, 5).map(interaction => (
                <tr key={interaction.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    {new Date(interaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">{interaction.type}</td>
                  <td className="p-2">{interaction.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No interactions recorded yet</p>
        )}
      </div>
    </div>
  );
}