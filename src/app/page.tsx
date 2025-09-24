"use client";
import { useState } from "react";

type Allocation = {
  equipmentId: number;
  quantity: number;
  competition: string;
};

type User = {
  name: string;
  role: "admin" | "user";
  allocations: Allocation[];
};

type Equipment = {
  id: number;
  name: string;
  quantity: number; // available
  total: number; // total stock
  price: number;
};

export default function InventoryApp() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [newEquipmentName, setNewEquipmentName] = useState("");
  const [newEquipmentQuantity, setNewEquipmentQuantity] = useState(0);
  const [newEquipmentPrice, setNewEquipmentPrice] = useState(0);

  const [competitions, setCompetitions] = useState<string[]>(["Hackathon"]);
  const [currentCompetition, setCurrentCompetition] = useState("Hackathon");
  const [newCompetition, setNewCompetition] = useState("");

  // LOGIN
  const handleLogin = () => {
    if (username === "admin" && password === "adminpass") {
      setUser({ name: "Admin", role: "admin", allocations: [] });
      setError("");
    } else if (username === "user" && password === "userpass") {
      setUser({ name: "User", role: "user", allocations: [] });
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUsername("");
    setPassword("");
  };

  // ADD EQUIPMENT
  const addEquipment = () => {
    if (newEquipmentName && newEquipmentQuantity > 0 && newEquipmentPrice > 0) {
      const newId =
        equipment.length > 0 ? Math.max(...equipment.map((e) => e.id)) + 1 : 1;
      setEquipment([
        ...equipment,
        {
          id: newId,
          name: newEquipmentName,
          quantity: newEquipmentQuantity,
          total: newEquipmentQuantity,
          price: newEquipmentPrice,
        },
      ]);
      setNewEquipmentName("");
      setNewEquipmentQuantity(0);
      setNewEquipmentPrice(0);
    }
  };

  // DEDUCT
  const deductEquipment = (id: number) => {
    setEquipment((prev) =>
      prev
        .map((e) =>
          e.id === id
            ? { ...e, total: Math.max(0, e.total - 1), quantity: Math.max(0, e.quantity - 1) }
            : e
        )
        .filter((e) => e.total > 0) // remove when total = 0
    );
  };

  // INCREASE STOCK
  const increaseStock = (id: number) => {
    setEquipment((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, total: e.total + 1, quantity: e.quantity + 1 }
          : e
      )
    );
  };

  // ALLOCATE
  const allocateEquipment = (equipmentId: number) => {
    if (!user) return;

    const eq = equipment.find((e) => e.id === equipmentId);
    if (!eq || eq.quantity <= 0) return;

    // Deduct from available
    setEquipment((prev) =>
      prev.map((e) =>
        e.id === equipmentId ? { ...e, quantity: e.quantity - 1 } : e
      )
    );

    // Update allocations for logged-in user
    const updatedUserAllocations = [...user.allocations];
    const existingAllocIndex = updatedUserAllocations.findIndex(
      (a) => a.equipmentId === equipmentId && a.competition === currentCompetition
    );

    if (existingAllocIndex !== -1) {
      updatedUserAllocations[existingAllocIndex] = {
        ...updatedUserAllocations[existingAllocIndex],
        quantity: updatedUserAllocations[existingAllocIndex].quantity + 1,
      };
    } else {
      updatedUserAllocations.push({
        equipmentId,
        quantity: 1,
        competition: currentCompetition,
      });
    }

    setUser({ ...user, allocations: updatedUserAllocations });

    // Update users array (for admin view)
    setUsers((prev) => {
      const existingUser = prev.find((u) => u.name === user.name);
      if (existingUser) {
        return prev.map((u) =>
          u.name === user.name ? { ...u, allocations: updatedUserAllocations } : u
        );
      } else {
        return [...prev, { ...user, allocations: updatedUserAllocations }];
      }
    });
  };

  // DEALLOCATE
  const deallocateEquipment = (equipmentId: number, competition: string) => {
    if (!user) return;

    const updatedUserAllocations = user.allocations
      .map((a) =>
        a.equipmentId === equipmentId && a.competition === competition
          ? { ...a, quantity: a.quantity - 1 }
          : a
      )
      .filter((a) => a.quantity > 0);

    setUser({ ...user, allocations: updatedUserAllocations });

    // Update users array (for admin view)
    setUsers((prev) =>
      prev.map((u) =>
        u.name === user.name ? { ...u, allocations: updatedUserAllocations } : u
      )
    );

    // Return items to available stock
    setEquipment((prev) =>
      prev.map((e) =>
        e.id === equipmentId ? { ...e, quantity: e.quantity + 1 } : e
      )
    );
  };

  const lowStockEquipment = equipment.filter((e) => e.quantity < 3);

  // COST CALCULATION
  const getTotalCostForUser = (u: User) => {
    return u.allocations.reduce((sum, a) => {
      const eq = equipment.find((e) => e.id === a.equipmentId);
      return eq ? sum + eq.price * a.quantity : sum;
    }, 0);
  };

  // ================== UI ==================
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="p-8 bg-white rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login
          </h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="flex items-center gap-4">
          <p>
            Welcome, {user.name} ({user.role})
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Competition Selector */}
      <div className="p-4 flex items-center gap-2 bg-gray-100 border-b">
        <label className="font-semibold">Competition:</label>
        <select
          value={currentCompetition}
          onChange={(e) => setCurrentCompetition(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          {competitions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {user.role === "admin" && (
          <>
            <input
              type="text"
              placeholder="New Competition"
              value={newCompetition}
              onChange={(e) => setNewCompetition(e.target.value)}
              className="border px-3 py-2 rounded-md"
            />
            <button
              onClick={() => {
                if (newCompetition && !competitions.includes(newCompetition)) {
                  setCompetitions([...competitions, newCompetition]);
                  setCurrentCompetition(newCompetition);
                  setNewCompetition("");
                }
              }}
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
            >
              Add
            </button>
          </>
        )}
      </div>

      <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Equipment List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Available Equipment</h2>
          {equipment.length === 0 && <p>No equipment added yet.</p>}
          <div className="space-y-4">
            {equipment.map((eq) => (
              <div
                key={eq.id}
                className={`flex justify-between items-center border p-3 rounded-md ${
                  eq.quantity < 3 ? "bg-yellow-50 border-yellow-300" : ""
                }`}
              >
                <div>
                  <p className="font-bold">{eq.name}</p>
                  <p className="text-sm text-gray-600">
                    {eq.quantity}/{eq.total} available
                  </p>
                  <p className="text-sm text-gray-500">Price: ₹{eq.price}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => allocateEquipment(eq.id)}
                    disabled={eq.quantity <= 0}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 disabled:opacity-50"
                  >
                    {eq.quantity > 0 ? "Allocate" : "No Stock"}
                  </button>
                  {user.role === "admin" && (
                    <>
                      <button
                        onClick={() => deductEquipment(eq.id)}
                        disabled={eq.total <= 0}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 disabled:opacity-50"
                      >
                        Deduct
                      </button>
                      <button
                        onClick={() => increaseStock(eq.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                      >
                        Add
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Panel */}
        {user.role === "admin" && (
          <div className="space-y-6">
            {/* Add Equipment Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Add New Equipment</h2>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Name"
                  value={newEquipmentName}
                  onChange={(e) => setNewEquipmentName(e.target.value)}
                  className="flex-grow px-3 py-2 border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newEquipmentQuantity || ""}
                  onChange={(e) =>
                    setNewEquipmentQuantity(
                      e.target.value === "" ? 0 : parseInt(e.target.value)
                    )
                  }
                  className="w-24 px-3 py-2 border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newEquipmentPrice || ""}
                  onChange={(e) =>
                    setNewEquipmentPrice(
                      e.target.value === "" ? 0 : parseFloat(e.target.value)
                    )
                  }
                  className="w-24 px-3 py-2 border rounded-md"
                />
                <button
                  onClick={addEquipment}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* User Allocations grouped by User -> Competition */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">User Allocations</h2>
              {users.length === 0 && <p>No allocations yet.</p>}
              <div className="space-y-4">
                {users.map((u) => (
                  <div key={u.name} className="border rounded-md p-3">
                    <h3 className="font-bold mb-2 text-lg">{u.name}</h3>
                    {competitions
                      .filter((comp) =>
                        u.allocations.some((a) => a.competition === comp)
                      )
                      .map((comp) => (
                        <div key={comp} className="mb-2 ml-4">
                          <p className="font-semibold">{comp}</p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {u.allocations
                              .filter((a) => a.competition === comp)
                              .map((a) => {
                                const eq = equipment.find((e) => e.id === a.equipmentId);
                                return (
                                  <li key={a.equipmentId}>
                                    {eq?.name || "Unknown"} x{a.quantity} | ₹
                                    {eq?.price * a.quantity}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      ))}
                    <p className="text-sm font-semibold text-gray-700">
                      Total Cost: ₹{getTotalCostForUser(u)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User Allocations */}
        {user.role === "user" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">My Allocations</h2>
            {user.allocations.length === 0 ? (
              <p>No allocations yet.</p>
            ) : (
              <div className="space-y-4">
                {competitions
                  .filter((comp) =>
                    user.allocations.some((a) => a.competition === comp)
                  )
                  .map((comp) => (
                    <div key={comp} className="mb-2 ml-4">
                      <p className="font-semibold">{comp}</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {user.allocations
                          .filter((a) => a.competition === comp)
                          .map((a) => {
                            const eq = equipment.find((e) => e.id === a.equipmentId);
                            return (
                              <li key={a.equipmentId} className="flex justify-between">
                                <span>
                                  {eq?.name || "Unknown"} x{a.quantity} | ₹
                                  {eq?.price * a.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    deallocateEquipment(a.equipmentId, comp)
                                  }
                                  className="bg-orange-400 text-white px-2 py-0.5 rounded hover:bg-orange-500 text-xs ml-2"
                                >
                                  Deallocate
                                </button>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}