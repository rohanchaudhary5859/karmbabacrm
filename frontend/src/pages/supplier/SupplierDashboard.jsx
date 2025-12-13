import React from "react";

export default function SupplierDashboard() {
  const stats = [
    { label: "New Leads Today", value: 8 },
    { label: "Match Score", value: "92%" },
    { label: "Avg Response Time", value: "1.4 hrs" },
    { label: "Monthly Orders", value: 27 },
  ];

  const leads = [
    { product: "Basmati Rice", buyer: "UAE Buyer", qty: "20 Tons", score: 95, status: "Hot" },
    { product: "Spices Mix", buyer: "USA Buyer", qty: "3 Tons", score: 82, status: "Warm" },
    { product: "Wheat Flour", buyer: "Saudi Buyer", qty: "15 Tons", score: 74, status: "Cold" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Supplier Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className="text-xl font-bold mt-2">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Incoming Leads</h2>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2">Product</th>
              <th className="p-2">Buyer</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Match Score</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">{l.product}</td>
                <td className="p-2">{l.buyer}</td>
                <td className="p-2">{l.qty}</td>
                <td className="p-2 text-blue-600 font-semibold">{l.score}%</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-white ${l.status==="Hot"?"bg-red-500":l.status==="Warm"?"bg-yellow-500":"bg-blue-600"}`}>
                    {l.status}
                  </span>
                </td>
                <td className="p-2"><button className="text-blue-600">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
