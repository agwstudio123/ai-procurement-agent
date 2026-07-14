import { useState } from "react";

export default function BOQForm({ onResult }) {
  const [cement, setCement] = useState("");
  const [steel, setSteel] = useState("");
  const [blocks, setBlocks] = useState("");
  const [budget, setBudget] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    // Get registered suppliers from localStorage
    const registeredSuppliers = JSON.parse(
  localStorage.getItem("suppliers") || "[]"
);

    try {
      const response = await fetch(
        "http://localhost:3000/procurement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            cement: Number(cement),
            steel: Number(steel),
            blocks: Number(blocks),
            budget: Number(budget),
            registeredSuppliers,
          }),
        }
      );

      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      if (onResult) {
  onResult(data.supplier);
}
    } catch (error) {
      console.log(error);
      alert("Backend connection failed");
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6">
        Bill of Quantities
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Cement */}
        <div>
          <label className="block mb-2 font-medium">
            Cement (Bags)
          </label>

          <input
            type="number"
            value={cement}
            onChange={(e) => setCement(e.target.value)}
            placeholder="Enter cement quantity"
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Steel */}
        <div>
          <label className="block mb-2 font-medium">
            Steel (Lengths)
          </label>

          <input
            type="number"
            value={steel}
            onChange={(e) => setSteel(e.target.value)}
            placeholder="Enter steel quantity"
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Blocks */}
        <div>
          <label className="block mb-2 font-medium">
            Blocks
          </label>

          <input
            type="number"
            value={blocks}
            onChange={(e) => setBlocks(e.target.value)}
            placeholder="Enter blocks quantity"
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block mb-2 font-medium">
            Budget (USDC)
          </label>

          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter your budget"
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Get AI Recommendation
        </button>
      </form>
    </div>
  );
}