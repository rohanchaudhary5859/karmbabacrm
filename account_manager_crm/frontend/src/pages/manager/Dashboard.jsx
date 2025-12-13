
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ManagerDashboard(){
  const [managers, setManagers] = useState([]);
  useEffect(()=>{ axios.get('/api/account-manager/managers').then(r=>setManagers(r.data)); },[]);
  return (
    <div style={{padding:20}}>
      <h2>Account Managers</h2>
      <ul>{managers.map(m=> <li key={m.id}><Link to={'/manager/supplier/'+m.id}>{m.name} — {m.assignments?.length || 0} suppliers</Link></li>)}</ul>
    </div>
  );
}
