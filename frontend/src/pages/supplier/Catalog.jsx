import React, { useState } from "react";

export default function Catalog() {
  const [items, setItems] = useState([{ id:1, name:"Basmati Rice 1121", moq:"5 Tons", price:"₹45,000 / Ton" }]);
  const [form, setForm] = useState({ name:"", moq:"", price:"" });

  const addItem = () => {
    if (!form.name) return;
    setItems(s => [{ id: Date.now(), ...form }, ...s]);
    setForm({ name:"", moq:"", price:"" });
  };

  const remove = (id) => setItems(s => s.filter(x => x.id !== id));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Product Catalog</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Product name" className="p-2 border rounded" />
          <input value={form.moq} onChange={(e)=>setForm({...form,moq:e.target.value})} placeholder="MOQ" className="p-2 border rounded" />
          <input value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} placeholder="Price" className="p-2 border rounded" />
        </div>
        <div className="mt-3"><button onClick={addItem} className="bg-blue-600 text-white px-4 py-2 rounded">Add Product</button></div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Your Products</h3>
        <ul className="space-y-3">
          {items.map(it => (
            <li key={it.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-500">MOQ: {it.moq} • {it.price}</div>
              </div>
              <div>
                <button className="text-blue-600 mr-3">Edit</button>
                <button onClick={()=>remove(it.id)} className="text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
