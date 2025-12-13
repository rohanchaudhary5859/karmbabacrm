import React, { useState } from "react";

export default function EscrowPanel() {
  const [txns, setTxns] = useState([{ id:1, buyer:"UAE Importer", supplier:"Golden Agro", amount:120000, status:"Held" }]);

  const release = (id) => {
    setTxns(t => t.map(x => x.id===id? {...x,status:"Released"}:x));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Escrow Panel</h1>

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2">Buyer</th>
              <th className="p-2">Supplier</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {txns.map(t => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{t.buyer}</td>
                <td className="p-2">{t.supplier}</td>
                <td className="p-2">₹{t.amount.toLocaleString()}</td>
                <td className="p-2">{t.status}</td>
                <td className="p-2">{t.status!=="Released" && <button onClick={()=>release(t.id)} className="bg-green-600 text-white px-3 py-1 rounded">Release</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
