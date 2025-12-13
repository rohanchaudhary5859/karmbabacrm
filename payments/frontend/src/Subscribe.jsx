import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Subscribe(){
  const [plans,setPlans] = useState([]);
  useEffect(()=>{ axios.get('/api/payments/plans').then(r=>setPlans(r.data)); },[]);

  async function stripeCheckout(tier){
    const res = await axios.post('/api/payments/create-stripe-session', { tier });
    window.location.href = res.data.url;
  }
  async function razorpayOrder(tier){
    const res = await axios.post('/api/payments/create-razorpay-order', { tier });
    const order = res.data.order;
    // open Razorpay checkout (frontend integration required)
    alert('Order created: ' + order.id + '. Integrate Razorpay checkout to complete purchase.');
  }

  return (<div style={{padding:20}}>
    <h2>Subscribe</h2>
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12}}>
      {plans.map(p=> (
        <div key={p.code} style={{border:'1px solid #ddd', padding:12}}>
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
          <button onClick={()=>stripeCheckout(p.code)}>Pay with Stripe</button>
          <button onClick={()=>razorpayOrder(p.code)}>Pay with Razorpay</button>
        </div>
      ))}
    </div>
  </div>);
}
