import { useState, useEffect } from "react";

import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import SupplierTable from "../components/SupplierTable";
import AIReport from "../components/AIRecommendation";
import BOQForm from "../components/BOQForm";

export default function Dashboard() {
  console.log("DASHBOARD LOADED");

  const [result, setResult] = useState(null);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [contractor, setContractor] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.log(err));

    fetch("http://localhost:3000/suppliers")
      .then((res) => res.json())
      .then((data) => {
        setSuppliers(data);
      })
      .catch((err) => console.log(err));

    const savedContractor = JSON.parse(
      localStorage.getItem("currentContractor")
    );

    if (savedContractor) {
      setContractor(savedContractor);
    }
  }, []);

  const totalOrders = orders.length;

  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const activeProjects = orders.filter(
    (order) => order.status !== "Completed"
  ).length;

  const totalPaid = orders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce(
      (sum, order) =>
        sum + Number(order.amount || order.totalAmount || 0),
      0
    );

  const moneySaved = orders
    .filter(
      (order) =>
        order.contractorId === contractor?.id &&
        order.status === "Completed" &&
        order.paymentStatus === "Paid"
    )
    .reduce(
      (sum, order) => sum + Number(order.savings || 0),
      0
    );

  const trustedSuppliers = suppliers.filter(
    (supplier) => supplier.trusted === true
  ).length;

  const walletConnected = !!contractor?.wallet;

  return (
    <div className="p-8">
      <Header />

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-6 mt-8">
        <StatsCard
          title="Wallet"
          value={
            walletConnected
              ? "🟢 Connected"
              : "🔴 Not Connected"
          }
          color="bg-blue-600"
        />

        <StatsCard
          title="Trusted Suppliers"
          value={trustedSuppliers}
          color="bg-green-600"
        />

        <StatsCard
          title="Active Projects"
          value={activeProjects}
          color="bg-purple-600"
        />

        <StatsCard
          title="Money Saved"
          value={`${moneySaved.toFixed(5)} USDC`}
          color="bg-orange-500"
        />
      </div>

      {/* BOQ Form */}
      <div className="mt-8">
        <BOQForm
          onResult={(data) => {
            setResult(data);
          }}
        />
      </div>

      {/* AI Report */}
      <div className="mt-8">
        <AIReport
          totalOrders={totalOrders}
          completedOrders={completedOrders}
          pendingOrders={pendingOrders}
          totalPaid={totalPaid}
          trustedSuppliers={trustedSuppliers}
          supplierResult={result}
        />
      </div>

      {/* AI Selected Supplier */}
      <div className="mt-8">
        {result?.supplier && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">
              🤖 AI Selected Supplier
            </h2>

            <div className="space-y-2">
              <p>
                <strong>Supplier:</strong> {result.supplier.name}
              </p>

              <p>
                <strong>Trust Score:</strong>{" "}
                {result.supplier.trustScore}/100
              </p>

              <p>
                <strong>Material Cost:</strong>{" "}
                {Number(result.supplier.totalCost).toFixed(5)} USDC
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {result.supplier.trusted
                  ? "✅ Trusted Supplier"
                  : "Unverified"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Supplier Comparison */}
      <div className="mt-8">
        <SupplierTable />
      </div>
    </div>
  );
}