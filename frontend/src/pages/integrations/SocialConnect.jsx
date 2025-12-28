import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SocialConnect(){
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAccounts = async () => {
    try {
      const res = await axios.get('/api/social/accounts');
      setAccounts(res.data.accounts || []);
    } catch (err) {
      console.error('Load accounts error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAccounts(); }, []);

  const connect = async (provider) => {
    try {
      const res = await axios.get(`/api/social/oauth/${provider}`);
      // In a real flow, redirect user to provider URL. For now open placeholder
      const url = res.data.url || `/api/social/oauth/${provider}`;
      window.open(url, '_blank');
    } catch (err) {
      console.error('Connect error', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Integrations</h1>
      <p className="text-sm text-gray-600 mb-4">Connect external accounts to import leads and contacts.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <button onClick={() => connect('linkedin')} className="p-4 bg-blue-600 text-white rounded">Connect LinkedIn</button>
        <button onClick={() => connect('facebook')} className="p-4 bg-blue-800 text-white rounded">Connect Facebook</button>
        <button onClick={() => connect('google')} className="p-4 bg-red-600 text-white rounded">Connect Google</button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Connected Accounts</h2>
        {loading ? (
          <div>Loading...</div>
        ) : accounts.length ? (
          <ul className="space-y-2">
            {accounts.map(a => (
              <li key={a.id} className="border p-2 rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{a.provider}</div>
                  <div className="text-sm text-gray-500">ID: {a.providerId || '-'}</div>
                </div>
                <div className="text-sm text-gray-500">Connected: {new Date(a.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No accounts connected</p>
        )}
      </div>
    </div>
  );
}
