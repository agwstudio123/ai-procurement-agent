import { useState } from "react";

export default function PayButton({ supplier }) {
  const [message, setMessage] = useState("");

  async function handlePlaceOrder() {
    console.log("BUTTON CLICKED");

    const contractor = JSON.parse(
      localStorage.getItem("currentContractor")
    );

    if (!contractor) {
      alert("Please login as a contractor first.");
      return;
    }

    if (!supplier || !supplier.id) {
      alert("Supplier not found.");
      console.log("Supplier received:", supplier);
      return;
    }

    try {
      // Get existing orders
      const existingResponse = await fetch(
        "http://localhost:3000/orders"
      );

      const orders = await existingResponse.json();

      const existingOrder = orders.find(
        (order) =>
          order.contractorId === contractor.id &&
          order.supplierId === supplier.id &&
          order.status === "Pending"
      );

      if (existingOrder) {
        alert(
          "You already have a pending order with this supplier."
        );
        return;
      }

      const newOrder = {
        id: Date.now(),

        contractorId: contractor.id,
        contractorName: contractor.companyName,
        contractorEmail: contractor.email,

        supplierId: supplier.id,
        supplierName: supplier.companyName,
        supplierWallet: supplier.wallet,

        amount: Number(supplier.totalCost),
        totalAmount: Number(supplier.totalCost),

        status: "Pending",
        paymentStatus: "Unpaid",

        createdAt: new Date().toLocaleString(),
      };

      console.log("NEW ORDER:", newOrder);

      const response = await fetch(
        "http://localhost:3000/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOrder),
        }
      );

      const data = await response.json();

      console.log("SERVER RESPONSE:", data);

      if (!data.success) {
        alert("Failed to place order.");
        return;
      }

      setMessage(
        "✅ Order sent successfully. Waiting for supplier acceptance."
      );
    } catch (error) {
      console.error("ERROR:", error);
      alert("Unable to connect to backend.");
    }
  }

  return (
    <div>
      <button
        onClick={handlePlaceOrder}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl mt-4"
      >
        📦 Place Order
      </button>

      {message && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="font-semibold text-blue-700">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}