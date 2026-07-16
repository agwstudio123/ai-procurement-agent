import { useEffect, useState } from "react";

export default function SupplierTrustScore() {
  const [score, setScore] = useState(95);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [paidOrders, setPaidOrders] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const supplier = JSON.parse(
          localStorage.getItem("currentSupplier")
        );

        const response = await fetch("http://localhost:3000/orders");
        const orders = await response.json();

        const myOrders = orders.filter(
          (order) => order.supplierId === supplier.id
        );

        const completed = myOrders.filter(
          (order) => order.status === "Completed"
        );

        const paid = myOrders.filter(
          (order) => order.paymentStatus === "Paid"
        );

        setCompletedOrders(completed.length);
        setPaidOrders(paid.length);

        const trust =
          70 +
          completed.length * 3 +
          paid.length * 2;

        setScore(Math.min(trust, 100));
      } catch (err) {
        console.log(err);
      }
    }

    loadData();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        ⭐ Supplier Trust Score
      </h1>

      <p className="text-gray-500 mt-2">
        Your reputation based on completed deliveries and successful payments.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Trust Score
          </p>

          <h2 className="text-5xl font-bold text-green-600 mt-2">
            {score}/100
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Completed Orders
          </p>

          <h2 className="text-5xl font-bold mt-2">
            {completedOrders}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Paid Orders
          </p>

          <h2 className="text-5xl font-bold text-blue-600 mt-2">
            {paidOrders}
          </h2>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-8">

        <div className="flex justify-between mb-3">
          <span className="font-semibold">
            Overall Reputation
          </span>

          <span>{score}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${score}%` }}
          />
        </div>

      </div>

      <div className="bg-blue-50 rounded-xl p-6 mt-8 border border-blue-200">

        <h2 className="font-bold text-xl">
          🤖 AI Recommendation
        </h2>

        <p className="mt-3 text-gray-700">
          Complete orders on time and maintain successful USDC payments to
          increase your trust score and attract more contractors.
        </p>

      </div>
    </div>
  );
}