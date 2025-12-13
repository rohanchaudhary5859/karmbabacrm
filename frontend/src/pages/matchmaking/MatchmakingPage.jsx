import React, { useState } from "react";

export default function MatchmakingPage() {
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");

  const suppliers = [
    { name:"Golden Agro Foods", product:"Basmati Rice", score:95, country:"India", capacity:"100 Tons", certs:["FSSAI","ISO"] },
    { name:"Indian Spices Co.", product:"Spices Mix", score:88, country:"India", capacity:"10 Tons", certs:["FSSAI","HACCP"] },
    { name:"Modern Steels Ltd.", product:"Steel Rods", score:73, country:"India", capacity:"500 Tons", certs:["ISO"] },
  ];

  const filtered = suppliers.filter(s => (!category || s.product.toLowerCase().includes(category.toLowerCase())) && (!country || s.country===country));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">AI Matchmaking Engine</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Product (Rice, Spices...)" className="p-2 border rounded" />
          <select value={country} onChange={e=>setCountry(e.target.value)} className="p-2 border rounded">
            <option value="">Any country</option>
            <option value="India">India</option>
            <option value="UAE">UAE</option>
            <option value="USA">USA</option>
          </select>
          <div>
            <button onClick={()=>{setCategory(""); setCountry("");}} className="bg-gray-200 px-3 py-2 rounded">Reset</button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((s,i)=>(
          <div key={i} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-gray-500">{s.product} • {s.capacity}</div>
              <div className="text-sm text-gray-500">Certs: {s.certs.join(", ")}</div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${s.score>90?"text-green-600":s.score>80?"text-yellow-600":"text-red-600"}`}>{s.score}%</div>
              <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">Assign Supplier</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
