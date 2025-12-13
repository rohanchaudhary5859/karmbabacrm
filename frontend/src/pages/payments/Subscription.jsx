import React from "react";

export default function Subscription() {
  const plans = [
    { id:"basic", name:"Basic", price:0, leads:5 },
    { id:"standard", name:"Standard", price:3999, leads:15 },
    { id:"premium", name:"Premium", price:7999, leads:40 },
    { id:"elite", name:"Elite", price:14999, leads:60 },
  ];

  const choose = (p) => alert(`Mock subscribe: ${p.name}`);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subscription Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {plans.map(p => (
          <div key={p.id} className="bg-white p-4 rounded shadow text-center">
            <div className="text-lg font-semibold">{p.name}</div>
            <div className="text-2xl font-bold mt-2">₹{p.price.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-2">{p.leads} leads / month</div>
            <button onClick={()=>choose(p)} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Choose</button>
          </div>
        ))}
      </div>
    </div>
  );
}
