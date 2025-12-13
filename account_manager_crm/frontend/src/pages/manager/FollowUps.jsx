
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function FollowUps(){
  const [list,setList] = useState([]);
  useEffect(()=>{ axios.get('/api/account-manager/followup/list/manager1').then(r=>setList(r.data)); },[]);
  return (<div style={{padding:20}}>
    <h2>My FollowUps</h2>
    <ul>{list.map(f=> <li key={f.id}>{f.message} — Next: {f.nextActionAt}</li>)}</ul>
  </div>);
}
