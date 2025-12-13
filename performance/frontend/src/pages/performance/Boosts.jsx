import React, { useState } from 'react';
import axios from 'axios';

export default function Boosts(){
  const supplierId = 'supplier_demo';
  const [start,setStart] = useState('2025-01-01');
  const [end,setEnd] = useState('2025-01-07');
  const [budget,setBudget] = useState(1000);

  async function startBoost(){
    await axios.post(`/api/performance/supplier/${supplierId}/boost`, { startDate: start, endDate: end, budget });
    alert('Boost requested');
  }

  return (
    <div style={{padding:20}}>
      <h2>Boost Campaigns</h2>
      <div><label>Start: <input type="date" value={start} onChange={e=>setStart(e.target.value)} /></label></div>
      <div><label>End: <input type="date" value={end} onChange={e=>setEnd(e.target.value)} /></label></div>
      <div><label>Budget: <input type="number" value={budget} onChange={e=>setBudget(e.target.value)} /></label></div>
      <button onClick={startBoost}>Start Boost</button>
    </div>
  );
}
