
import React, { useState } from 'react';
import axios from 'axios';

export default function LeadQualify(){
  const [leadId, setLeadId] = useState('');
  const [status, setStatus] = useState('PENDING');
  async function submit(){ await axios.post('/api/account-manager/lead/qualify', { leadId, status, qualifiedBy: 'manager1' }); alert('Saved'); }
  return (<div style={{padding:20}}>
    <h2>Lead Qualification</h2>
    <input placeholder="Lead ID" value={leadId} onChange={e=>setLeadId(e.target.value)} />
    <select value={status} onChange={e=>setStatus(e.target.value)}><option>PENDING</option><option>QUALIFIED</option><option>REJECTED</option></select>
    <button onClick={submit}>Save</button>
  </div>);
}
