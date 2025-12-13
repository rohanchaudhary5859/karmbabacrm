import React, { useState } from "react";

export default function InvoiceGenerator() {
  const [order, setOrder] = useState({ buyer:"", product:"", qty:"", price:"" });
  const [link, setLink] = useState("");

  const generate = (e) => {
    e.preventDefault();
    // mock link
    setLink("/mock-invoice.pdf");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Invoice / Export Document Generator</h1>

      <div className="bg-white p-4 rounded shadow">
        <form onSubmit={generate} className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="Buyer name" value={order.buyer} onChange={e=>setOrder({...order,buyer:e.target.value})} />
          <input className="w-full p-2 border rounded" placeholder="Product" value={order.product} onChange={e=>setOrder({...order,product:e.target.value})} />
          <input className="w-full p-2 border rounded" placeholder="Quantity" value={order.qty} onChange={e=>setOrder({...order,qty:e.target.value})} />
          <input className="w-full p-2 border rounded" placeholder="Price" value={order.price} onChange={e=>setOrder({...order,price:e.target.value})} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Generate</button>
        </form>

        {link && (
          <div className="mt-3">
            <a className="text-blue-600 underline" href={link} target="_blank" rel="noreferrer">Open Invoice</a>
          </div>
        )}
      </div>
    </div>
  );
}
