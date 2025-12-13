import React from "react";

export default function ManagerDashboard() {
  const stats = [
    { label: "Total Suppliers", value: 145 },
    { label: "Total Buyers", value: 420 },
    { label: "Active Leads", value: 57 },
    { label: "Pending Verifications", value: 9 },
  ];

  const assignments = [
    { product: "Basmati Rice", buyer: "UAE Importer", supplier: "Golden Agro", status: "Pending Review", urgency: "High" },
    { product: "Spices Mix", buyer: "USA Retailer", supplier: "Indian Masala Co.", status: "Assigned", urgency: "Medium" },
    { product: "Steel Rods", buyer: "Dubai Construction", supplier: "Modern Steels", status: "In Progress", urgency: "Low" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className="text-2xl font-bold mt-2">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-4">Lead Assignment Overview</h2>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2">Product</th>
              <th className="p-2">Buyer</th>
              <th className="p-2">Supplier</th>
              <th className="p-2">Status</th>
              <th className="p-2">Urgency</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">{a.product}</td>
                <td className="p-2">{a.buyer}</td>
                <td className="p-2">{a.supplier}</td>
                <td className="p-2">{a.status}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-white ${a.urgency==="High"?"bg-red-500":a.urgency==="Medium"?"bg-yellow-500":"bg-green-600"}`}>
                    {a.urgency}
                  </span>
                </td>
                <td className="p-2"><button className="text-blue-600">Manage</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Verify Supplier</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded">Assign Leads</button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded">Export Report</button>
        </div>
      </div>
    </div>
  );
}
