"use client";
import { useEffect, useState } from "react";

export default function InventoryApp() {
  const [user, setUser] = useState<any>(null);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);

  const [newEquipmentName, setNewEquipmentName] = useState("");
  const [newEquipmentQuantity, setNewEquipmentQuantity] = useState(0);
  const [newEquipmentPrice, setNewEquipmentPrice] = useState(0);
  const [newCompetition, setNewCompetition] = useState("");

  // fetch initial data
  useEffect(() => {
    fetch("/api/equipment").then(r => r.json()).then(setEquipment);
    fetch("/api/competitions").then(r => r.json()).then(setCompetitions);
    fetch("/api/allocations").then(r => r.json()).then(setAllocations);
  }, []);

  const addEquipment = async () => {
    const res = await fetch("/api/equipment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newEquipmentName, quantity: newEquipmentQuantity, price: newEquipmentPrice })
    });
    const data = await res.json();
    setEquipment([...equipment, data]);
    setNewEquipmentName(""); setNewEquipmentQuantity(0); setNewEquipmentPrice(0);
  };

  const addCompetition = async () => {
    const res = await fetch("/api/competitions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCompetition })
    });
    const data = await res.json();
    setCompetitions([...competitions, data]);
    setNewCompetition("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      {/* Equipment List */}
      <h2 className="text-xl font-semibold mb-2">Equipment</h2>
      <ul className="mb-4">
        {equipment.map(eq => (
          <li key={eq.id} className="border p-2 rounded mb-2">
            {eq.name} — {eq.quantity}/{eq.total} available — ₹{eq.price}
          </li>
        ))}
      </ul>

      {/* Add Equipment */}
      <div className="mb-6">
        <input value={newEquipmentName} onChange={e => setNewEquipmentName(e.target.value)} placeholder="Name" className="border p-2 mr-2"/>
        <input type="number" value={newEquipmentQuantity} onChange={e => setNewEquipmentQuantity(parseInt(e.target.value))} placeholder="Qty" className="border p-2 mr-2"/>
        <input type="number" value={newEquipmentPrice} onChange={e => setNewEquipmentPrice(parseFloat(e.target.value))} placeholder="Price" className="border p-2 mr-2"/>
        <button onClick={addEquipment} className="bg-blue-600 text-white px-4 py-2">Add Equipment</button>
      </div>

      {/* Competitions */}
      <h2 className="text-xl font-semibold mb-2">Competitions</h2>
      <ul className="mb-4">
        {competitions.map(c => <li key={c.id}>{c.name}</li>)}
      </ul>
      <input value={newCompetition} onChange={e => setNewCompetition(e.target.value)} placeholder="New Competition" className="border p-2 mr-2"/>
      <button onClick={addCompetition} className="bg-green-600 text-white px-4 py-2">Add Competition</button>
    </div>
  );
}
