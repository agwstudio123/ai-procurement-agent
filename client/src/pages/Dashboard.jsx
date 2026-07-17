import { useState, useEffect } from "react";
import { API_URL } from "../api";

import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import SupplierChart from "../components/SupplierChart";
import SupplierTable from "../components/SupplierTable";
import AIReport from "../components/AIRecommendation";
import BOQForm from "../components/BOQForm";

export default function Dashboard() {
  const [result, setResult] = useState(null);

  const [trustedSuppliers, setTrustedSuppliers] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);

  const [walletConnected, setWalletConnected] = useState(false);

  const [totalOrders, setTotalOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    // Load suppliers
    fetch(`${API_URL}/suppliers`)
      .then((response) => response.json())
      .then((data) => {
        const trusted = data.filter(
          (supplier) => supplier.trusted === true
        );

        setTrustedSuppliers(trusted.length);
      });

    // Load orders
    fetch(`${API_URL}/orders`)
      .then((response) => response.json())
      .then((data) => {
        const contractor = JSON.parse(
          localStorage.getItem("currentContractor")
        );

        let myOrders = data;

        if (contractor) {
          myOrders = data.filter(
            (order) =>
              Number(order.contractorId) ===
              Number(contractor.id)
          );
        }

        setTotalOrders(myOrders.length);

        const completed = myOrders.filter(
          (order) => order.status === "Completed"
        );

        const pending = myOrders.filter(
          (order) => order.status === "Pending"
        );

        const active = myOrders.filter(
          (order) => order.status !== "Completed"
        );

        setCompletedOrders(completed.length);
        setPendingOrders(pending.length);
        setActiveProjects(active.length);

        const paid = myOrders
          .filter(
            (order) => order.paymentStatus === "Paid"
          )
          .reduce(
            (sum, order) =>
              sum +
              Number(
                order.totalAmount ||
                order.amount ||
                0
              ),
            0
          );

        setTotalPaid(paid);

        const saved = myOrders.reduce(
          (sum, order) =>
            sum + Number(order.savings || 0),
          0
        );

        setMoneySaved(saved);
      });

    // Wallet
    const contractor = JSON.parse(
      localStorage.getItem("currentContractor")
    );

    if (
      contractor &&
      contractor.wallet &&
      contractor.wallet !== "Not Connected"
    ) {
      setWalletConnected(true);
    } else {
      setWalletConnected(false);
    }
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="w-full p-4 md:p-8">

        <Header />

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

          <StatsCard
            title="Total Orders"
            value={totalOrders}
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
            onResult={(data) => setResult(data)}
          />
        </div>

        {/* Supplier Cost Chart */}
        <div className="mt-8">
          <SupplierChart />
        </div>

        {/* AI Procurement Report - Full Width */}
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

        {/* Supplier Comparison Table */}
        <div className="mt-8 mb-10">
          <SupplierTable />
        </div>

      </main>
    </div>
  );
}