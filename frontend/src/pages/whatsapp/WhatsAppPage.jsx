import React, { useState } from "react";

export default function WhatsAppPage(){
  const [to,setTo] = useState("");
  const [msg,setMsg] = useState("");
  const [logs,setLogs] = useState([]);

  const send = (e) => {
    e.preventDefault();
    if(!to||!msg) return alert("fill");
    setLogs(l => [{id:Date.now(),to,message:msg,status:"sent"}, ...l]);
    setMsg("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">WhatsApp Automation</h1>

      <div className="bg-white p-4 rounded shadow mb-4 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <form onSubmit={send} className="space-y-3">
            <input value={to} onChange={e=>setTo(e.target.value)} placeholder="To (phone)" className="w-full p-2 border rounded" />
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Message" className="w-full p-2 border rounded" rows="4" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
          </form>
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <h4 className="font-semibold mb-2">Recent Logs</h4>
          <div className="space-y-2 max-h-64 overflow-auto">
            {logs.length===0 && <div className="text-sm text-gray-500">No logs</div>}
            {logs.map(l => (
              <div key={l.id} className="p-2 border rounded">
                <div className="text-sm text-gray-600">{l.to}</div>
                <div>{l.message}</div>
                <div className="text-xs text-gray-500">Status: {l.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
