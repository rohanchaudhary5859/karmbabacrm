import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function WhatsAppPage(){
  const [to, setTo] = useState('');
  const [msg, setMsg] = useState('');
  const [logs, setLogs] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // placeholder: load logs from API when available
    // axios.get('/api/whatsapp/logs').then(r => setLogs(r.data.logs)).catch(() => {});
  }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!to || !msg) return;
    setSending(true);
    try {
      // If backend endpoint exists, call it. Fallback to local log.
      // await axios.post('/api/whatsapp/send', { to, message: msg });
      setLogs(l => [{ id: Date.now(), to, message: msg, status: 'sent', createdAt: new Date().toISOString() }, ...l]);
      setMsg('');
      setTo('');
    } catch (err) {
      setLogs(l => [{ id: Date.now(), to, message: msg, status: 'failed', createdAt: new Date().toISOString() }, ...l]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">WhatsApp Automation</h1>
        <Link to="/integrations" className="text-sm text-blue-600 hover:underline">Manage Integrations</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <form onSubmit={send} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input value={to} onChange={e => setTo(e.target.value)} placeholder="Recipient phone (e.g. +911234567890)" className="col-span-2 p-3 border rounded" />
              <select className="p-3 border rounded">
                <option>Send Now</option>
                <option>Schedule</option>
              </select>
            </div>

            <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type your message" rows={6} className="w-full p-3 border rounded" />

            <div className="flex items-center gap-3">
              <button type="submit" disabled={sending} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                {sending ? 'Sending...' : 'Send Message'}
              </button>
              <button type="button" onClick={() => { setTo(''); setMsg(''); }} className="px-4 py-2 border rounded">Clear</button>
            </div>
          </form>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Recent Logs</h3>
          <div className="space-y-3 max-h-72 overflow-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet</div>
            ) : (
              logs.map(l => (
                <div key={l.id} className="p-3 border rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{l.to}</div>
                      <div className="text-sm text-gray-500">{new Date(l.createdAt).toLocaleString()}</div>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${l.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{l.status}</div>
                  </div>
                  <div className="mt-2 text-sm">{l.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
