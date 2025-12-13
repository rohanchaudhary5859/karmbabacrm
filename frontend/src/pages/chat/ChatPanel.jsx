import React, { useState } from "react";

export default function ChatPanel(){
  const [messages,setMessages] = useState([{id:1,text:"Hi, how can I help?"}]);
  const [text,setText] = useState("");

  const send = ()=>{ if(!text) return; setMessages(m=>[...m,{id:Date.now(),text}]); setText(""); };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">In-app Chat</h1>

      <div className="bg-white p-4 rounded shadow max-w-2xl">
        <div className="space-y-3 mb-3 max-h-64 overflow-auto">
          {messages.map(m => <div key={m.id} className="p-2 border rounded">{m.text}</div>)}
        </div>

        <div className="flex gap-2">
          <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Type a message"/>
          <button onClick={send} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
        </div>
      </div>
    </div>
  );
}
