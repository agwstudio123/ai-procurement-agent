import { useState, useEffect } from "react";
import { API_URL } from "../api";

import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import SupplierChart from "../components/SupplierChart";
import SupplierTable from "../components/SupplierTable";
import AIReport from "../components/AIRecommendation";
import BOQForm from "../components/BOQForm";

export default function Dashboard() {
  console.log("DASHBOARD PAGE FILE LOADED");

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
    // ==========================
    // Suppliers
    // ==========================
    fetch(`${API_URL}/suppliers`)
      .then((response) => response.json())
      .then((data) => {
        const trusted = data.filter(
          (supplier) => supplier.trusted === true
        );

        setTrustedSuppliers(trusted.length);
      })
      .catch((error) => {
        console.log("SUPPLIER FETCH ERROR:", error);
      });

    // ==========================
    // Orders
    // ==========================
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
            (order) =>
              order.paymentStatus === "Paid"
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
      })
      .catch((error) => {
        console.log("ORDER FETCH ERROR:", error);
      });

    // ==========================
    // Wallet
    // ==========================
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
    <div className="flex bg-gray-100 min-h-screen">
      <main className="flex-1 p-8">
        <Header />

        <div className="grid grid-cols-4 gap-6 mt-8">
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

        <div className="mt-8">
          <BOQForm
            onResult={(data) => {
              setResult(data);
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="col-span-2">
            <SupplierChart />
          </div>

          <AIReport
            totalOrders={totalOrders}
            completedOrders={completedOrders}
            pendingOrders={pendingOrders}
            totalPaid={totalPaid}
            trustedSuppliers={trustedSuppliers}
            supplierResult={result}
          />
        </div>

        <div className="mt-8">
          <SupplierTable />
        </div>
      </main>
    </div>
  );
}