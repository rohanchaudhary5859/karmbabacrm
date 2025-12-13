import React, { useState } from "react";

export default function CategoryManager() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Rice" },
    { id: 2, name: "Pulses" },
    { id: 3, name: "Textiles" },
  ]);
  const [newCat, setNewCat] = useState("");

  const add = () => {
    if (!newCat.trim()) return;
    setCategories((c) => [...c, { id: Date.now(), name: newCat.trim() }]);
    setNewCat("");
  };

  const remove = (id) => setCategories((c) => c.filter((x) => x.id !== id));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Category Manager</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex gap-3">
          <input value={newCat} onChange={(e)=>setNewCat(e.target.value)} placeholder="New Category" className="flex-1 p-2 border rounded" />
          <button onClick={add} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">All Categories</h3>
        <ul className="space-y-2">
          {categories.map(c => (
            <li key={c.id} className="p-2 border rounded flex justify-between items-center">
              <span>{c.name}</span>
              <div>
                <button className="text-blue-600 mr-3">Edit</button>
                <button onClick={()=>remove(c.id)} className="text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
