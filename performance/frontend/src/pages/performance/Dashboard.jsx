import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PerformanceDashboard(){
  const [metrics, setMetrics] = useState(null);
  const supplierId = 'supplier_demo';

  useEffect(()=>{
    axios.get(`/api/performance/supplier/${supplierId}`).then(r=>setMetrics(r.data.metrics)).catch(()=>setMetrics(null));
  },[]);

  if(!metrics) return <div style={{padding:20}}>No metrics data yet for {supplierId}.</div>;

  return (
    <div style={{padding:20}}>
      <h2>Supplier Performance — {supplierId}</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
        <div style={{border:'1px solid #ddd', padding:12}}><h3>Daily Leads</h3><p>{metrics.dailyLeads}</p></div>
        <div style={{border:'1px solid #ddd', padding:12}}><h3>Monthly Leads</h3><p>{metrics.monthlyLeads}</p></div>
        <div style={{border:'1px solid #ddd', padding:12}}><h3>Product Views</h3><p>{metrics.productViews}</p></div>
        <div style={{border:'1px solid #ddd', padding:12}}><h3>Response Time Avg (s)</h3><p>{metrics.responseTimeAvg}</p></div>
        <div style={{border:'1px solid #ddd', padding:12}}><h3>Positive Feedback</h3><p>{metrics.positiveFeedback}</p></div>
        <div style={{border:'1px solid #ddd', padding:12}}><h3>Negative Feedback</h3><p>{metrics.negativeFeedback}</p></div>
      </div>
    </div>
  );
}
