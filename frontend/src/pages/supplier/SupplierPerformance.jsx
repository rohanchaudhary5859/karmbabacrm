import React from "react";

export default function SupplierPerformance() {
  const metrics = [
    { label: "Overall Rating", value: "4.6 / 5" },
    { label: "Matchmaking Score", value: "91%" },
    { label: "Lead Conversion Rate", value: "34%" },
    { label: "Avg Response Time", value: "1.2 hrs" },
  ];

  const feedbacks = [
    { buyer: "UAE Import House", rating: 5, comment: "Fast response and professional packing." },
    { buyer: "Saudi Food Trading", rating: 4, comment: "Good quality, needs price consistency." },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Supplier Performance</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-4 rounded shadow text-center">
            <div className="text-sm text-gray-500">{m.label}</div>
            <div className="text-xl font-bold mt-2">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Buyer Feedback</h3>
        <ul className="space-y-3">
          {feedbacks.map((f, i) => (
            <li key={i} className="p-3 border rounded">
              <div className="font-semibold">{f.buyer}</div>
              <div className="text-yellow-500">{'★'.repeat(f.rating)}</div>
              <div className="text-sm text-gray-600 mt-1">{f.comment}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
