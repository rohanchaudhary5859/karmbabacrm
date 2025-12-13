import React, { useState } from "react";

export default function BuyerDashboard() {
  const [search, setSearch] = useState("");
  const leads = [
    { id: 1, product: "Basmati Rice", qty: "50 Tons", status: "Hot", country: "UAE" },
    { id: 2, product: "Spices", qty: "2 Tons", status: "Warm", country: "USA" },
    { id: 3, product: "Wheat Flour", qty: "20 Tons", status: "Cold", country: "Saudi" }
  ];

  const filtered = leads.filter(l => l.product.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Buyer Dashboard</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex gap-3">
          <input placeholder="Search product..." value={search} onChange={(e)=>setSearch(e.target.value)} className="flex-1 p-2 border rounded" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Your Leads</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2">Product</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Country</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">{l.product}</td>
                <td className="p-2">{l.qty}</td>
                <td className="p-2">{l.country}</td>
                <td className="p-2"><span className={`px-2 py-1 rounded text-white ${l.status==="Hot"?"bg-red-500":l.status==="Warm"?"bg-yellow-500":"bg-blue-600"}`}>{l.status}</span></td>
                <td className="p-2"><button className="text-blue-600">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
