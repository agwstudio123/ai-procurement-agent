import { useState } from "react";
import { API_URL } from "../api";

export default function BOQ() {

  const [cement, setCement] = useState("");
  const [blocks, setBlocks] = useState("");
  const [steel, setSteel] = useState("");

  const [result, setResult] = useState(null);

  async function findSupplier() {

    try {

      const response = await fetch(
        `${API_URL}/procurement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            quantities: {
              cement,
              blocks,
              steel,
            },
          }),
        }
      );

      const data = await response.json();

      setResult(data);

    } catch (error) {

      console.log(
        "Procurement error:",
        error
      );

    }

  }

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold">
        📋 Bill of Quantities
      </h1>

      <p className="text-gray-600 mt-2">
        Enter your construction materials.
      </p>

      <div className="bg-white rounded-xl shadow p-6 mt-8 max-w-xl">

        {/* CEMENT */}

        <label className="font-semibold">
          Cement Quantity
        </label>

        <input
          type="number"
          value={cement}
          onChange={(e) => setCement(e.target.value)}
          placeholder="Example: 10"
          className="w-full border p-4 rounded mt-2 mb-5"
        />

        {/* BLOCKS */}

        <label className="font-semibold">
          Blocks Quantity
        </label>

        <input
          type="number"
          value={blocks}
          onChange={(e) => setBlocks(e.target.value)}
          placeholder="Example: 100"
          className="w-full border p-4 rounded mt-2 mb-5"
        />

        {/* STEEL */}

        <label className="font-semibold">
          Steel Quantity
        </label>

        <input
          type="number"
          value={steel}
          onChange={(e) => setSteel(e.target.value)}
          placeholder="Example: 20"
          className="w-full border p-4 rounded mt-2 mb-5"
        />

        <button
          onClick={findSupplier}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          🤖 Find Best Supplier
        </button>

      </div>

      {result && result.success && (

        <div className="bg-white rounded-xl shadow p-6 mt-8 max-w-xl">

          <h2 className="text-2xl font-bold">
            🤖 AI Recommendation
          </h2>

          <p className="mt-3">
            Supplier:
            <strong>
              {" "}
              {result.supplier.name}
            </strong>
          </p>

          <p className="mt-2">
            Total Cost:
            <strong>
              {" "}
              {result.supplier.totalCost} USDC
            </strong>
          </p>

          <button
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            ✅ Place Order
          </button>

        </div>

      )}

    </div>

  );

}