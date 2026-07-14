import { useState } from "react";

export default function BOQ() {
  const [cement, setCement] = useState("");
  const [blocks, setBlocks] = useState("");
  const [result, setResult] = useState(null);

  function findSupplier() {
    const suppliers =
      JSON.parse(localStorage.getItem("suppliers")) || [];

    if (suppliers.length === 0) {
      alert("No suppliers have registered yet.");
      return;
    }

    const cementQty = Number(cement);
    const blockQty = Number(blocks);

    let bestSupplier = null;

    suppliers.forEach((supplier) => {
      const cementPrice = Number(supplier.cementPrice || 0);
      const blockPrice = Number(supplier.blockPrice || 0);

      const total =
        cementQty * cementPrice +
        blockQty * blockPrice;

      if (!bestSupplier || total < bestSupplier.total) {
        bestSupplier = {
          supplierId: supplier.id,
          name: supplier.companyName,
          materials: supplier.materials,
          wallet: supplier.wallet,
          total,
        };
      }
    });

    setResult({
      ...bestSupplier,
      total: bestSupplier.total.toFixed(2),
    });
  }

  function sendOrder() {
    if (!result) return;

    const currentContractor = JSON.parse(
      localStorage.getItem("currentContractor")
    );

    const orders =
      JSON.parse(localStorage.getItem("orders")) || [];

    const order = {
      id: Date.now(),

      supplierId: result.supplierId,
      supplierName: result.name,

      contractorName:
        currentContractor?.companyName || "Contractor",

      project: "New Construction Project",

      material: `${cement} Cement Bags + ${blocks} Concrete Blocks`,

      amount: Number(result.total),
      totalAmount: Number(result.total),

      supplierWallet:
        result.wallet || "Not Connected",

      paymentStatus: "Unpaid",

      status: "Pending",

      createdAt: new Date().toLocaleString(),
    };

    orders.push(order);

    localStorage.setItem(
      "orders",
      JSON.stringify(orders)
    );

    alert("Order sent successfully.");

    setResult(null);
    setCement("");
    setBlocks("");
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold">
        📋 Bill of Quantities
      </h1>

      <p className="text-gray-600 mt-2">
        Enter your construction materials.
      </p>

      <div className="bg-white rounded-xl shadow p-6 mt-8 max-w-xl">
        <label className="font-semibold">
          Cement Quantity
        </label>

        <input
          value={cement}
          onChange={(e) => setCement(e.target.value)}
          className="w-full border p-3 rounded mt-2 mb-5"
          placeholder="Example: 10"
        />

        <label className="font-semibold">
          Blocks Quantity
        </label>

        <input
          value={blocks}
          onChange={(e) => setBlocks(e.target.value)}
          className="w-full border p-3 rounded mt-2"
          placeholder="Example: 100"
        />

        <button
          onClick={findSupplier}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          🤖 Find Best Supplier
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow p-6 mt-8 max-w-xl">
          <h2 className="text-2xl font-bold">
            AI Recommendation
          </h2>

          <p className="mt-3">
            Supplier:
            <b> {result.name}</b>
          </p>

          <p>
            Materials:
            <b> Cement + Blocks</b>
          </p>

          <p className="text-xl mt-3">
            Total:
            <b> {result.total} USDC</b>
          </p>

          <button
            onClick={sendOrder}
            className="mt-5 bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            🚚 Send Order Request
          </button>
        </div>
      )}
    </div>
  );
}