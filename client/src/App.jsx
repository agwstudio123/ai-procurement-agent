import { API_URL } from "./api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AIReport from "./components/AIReport";
import Layout from "./components/Layout";
import TrustedSuppliers from "./components/TrustedSuppliers";

import Notifications from "./pages/Notifications";
import SupplierEarnings from "./pages/SupplierEarnings";
import Login from "./pages/Login";
import RegisterChoice from "./pages/RegisterChoice";
import ContractorRegister from "./pages/ContractorRegister";
import SupplierRegister from "./pages/SupplierRegister";
import SupplierTrustScore from "./pages/SupplierTrustScore";
import Dashboard from "./pages/Dashboard";
import BOQ from "./pages/BOQ";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierMaterials from "./pages/SupplierMaterials";
import SupplierAddMaterial from "./pages/SupplierAddMaterial";
import SupplierProfile from "./pages/SupplierProfile";
import SupplierOrders from "./pages/SupplierOrders";
import ContractorOrders from "./pages/ContractorOrders";
import Chat from "./pages/Chat";

function History() {
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch(`${API_URL}/orders`);
        const data = await response.json();

        const contractor = JSON.parse(
  localStorage.getItem("currentContractor")
);

const myOrders = data.filter(
  (order) =>
    Number(order.contractorId) === Number(contractor?.id)
);

setOrders(
  myOrders.filter(
    (order) =>
      order.status === "Completed" &&
      order.paymentStatus === "Paid"
  )
);
      } catch (error) {
        console.log("Failed to load orders:", error);
      }
    }

    loadOrders();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">📜 Procurement History</h1>
      <p className="mt-2 text-gray-500">Completed purchases and payments.</p>

      <div className="mt-8 bg-white rounded-xl shadow overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-6 text-gray-500">
            No completed procurement records found.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Supplier</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-4 font-semibold">
                    {order.supplierName || "TRUST SUPPLIER LIMITED"}
                  </td>
                  <td className="p-4">{order.totalAmount || 0} USDC</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                      Paid
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Payments() {
  const [payments, setPayments] = React.useState([]);

  React.useEffect(() => {
    async function loadPayments() {
      try {
        const response = await fetch(`${API_URL}/orders`);
        const data = await response.json();

        const contractor = JSON.parse(
  localStorage.getItem("currentContractor")
);

const myPayments = data.filter(
  (order) =>
    Number(order.contractorId) === Number(contractor?.id)
);

setPayments(
  myPayments.filter(
    (order) =>
      order.paymentStatus === "Paid"
  )
);
      } catch (error) {
        console.log("Failed to load payments:", error);
      }
    }

    loadPayments();
  }, []);

  const totalPaid = payments.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">💳 Payments</h1>
      <p className="mt-2 text-gray-500">USDC transaction history.</p>

      <div className="mt-6 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold">Total Paid</h2>
        <p className="text-2xl mt-2">{totalPaid.toFixed(5)} USDC</p>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow overflow-hidden">
        {payments.length === 0 ? (
          <p className="p-6 text-gray-500">No payments found.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Supplier</th>
                <th className="p-4 text-left">Wallet Address</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-t">
                  <td className="p-4 font-semibold">
                    {payment.supplierName || "Supplier"}
                  </td>
                  <td className="p-4 text-xs">
                    {payment.supplierWallet
                      ? `${payment.supplierWallet.slice(0, 6)}...${payment.supplierWallet.slice(-4)}`
                      : "Wallet unavailable"}
                  </td>
                  <td className="p-4">{payment.totalAmount || 0} USDC</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                      Paid
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Analytics() {
  const [orders, setOrders] = React.useState([]);
  const [trustedSuppliers, setTrustedSuppliers] = React.useState([]);

  React.useEffect(() => {
    async function loadData() {
      try {
        const ordersResponse = await fetch(`${API_URL}/orders`);
        const ordersData = await ordersResponse.json();
        const contractor = JSON.parse(
  localStorage.getItem("currentContractor")
);

const myOrders = ordersData.filter(
  (order) =>
    Number(order.contractorId) === Number(contractor?.id)
);
setOrders(myOrders);
console.log("Logged Contractor ID:", contractor?.id);
console.log("All Orders:", ordersData);
console.log("Filtered Orders:", myOrders);

        const suppliersResponse = await fetch(`${API_URL}/trusted-suppliers`);
        const suppliersData = await suppliersResponse.json();
        setTrustedSuppliers(suppliersData);
      } catch (error) {
        console.log("Analytics Error:", error);
      }
    }

    loadData();
  }, []);

  const totalOrders = orders.length;

  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const totalPaid = orders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "Paid"
  ).length;

  const unpaidOrders = orders.filter(
    (order) => order.paymentStatus === "Unpaid"
  ).length;

  const orderChart = [
    { name: "Pending", value: pendingOrders },
    { name: "Completed", value: completedOrders },
  ];

  const paymentChart = [
    { name: "Paid", value: paidOrders },
    { name: "Unpaid", value: unpaidOrders },
  ];

  const COLORS = ["#10B981", "#F59E0B"];

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">📊 Analytics</h1>
      <p className="mt-2 text-gray-500">Procurement performance overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Total Orders</p>
          <h2 className="text-4xl font-bold mt-2">{totalOrders}</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Completed Orders</p>
          <h2 className="text-4xl font-bold mt-2 text-green-600">
            {completedOrders}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Pending Orders</p>
          <h2 className="text-4xl font-bold mt-2 text-yellow-500">
            {pendingOrders}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Total Paid</p>
          <h2 className="text-4xl font-bold mt-2 text-blue-600">
            {totalPaid.toFixed(5)} USDC
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Orders Bar Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-6">Orders Overview</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Pie Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-6">Payment Status</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentChart}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {paymentChart.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold">🤝 Trusted Suppliers</h2>
        <p className="text-5xl font-bold text-purple-600 mt-4">
          {trustedSuppliers.length}
        </p>
        <p className="text-gray-500 mt-2">
          Suppliers with completed paid transactions.
        </p>
      </div>

      <AIReport
        totalOrders={totalOrders}
        completedOrders={completedOrders}
        pendingOrders={pendingOrders}
        totalPaid={totalPaid}
        trustedSuppliers={trustedSuppliers.length}
      />
    </div>
  );
}

function Settings() {

  const contractor =
    JSON.parse(localStorage.getItem("currentContractor")) || {};
const walletConnected =
  contractor &&
  contractor.wallet &&
  contractor.wallet !== "Not Connected";
  const [wallet, setWallet] = React.useState(
    contractor.wallet || ""
  );

  const [loading, setLoading] = React.useState(false);


  async function saveWallet() {

    if (!contractor.id) {
      alert("Contractor account not found.");
      return;
    }


    if (!wallet.trim()) {
      alert("Wallet address cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/contractors/${contractor.id}/wallet`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wallet }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const updatedContractor = {
          ...contractor,
          wallet,
        };

        localStorage.setItem(
          "currentContractor",
          JSON.stringify(updatedContractor)
        );

        alert("✅ Wallet updated successfully");
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to update wallet.");
    }

    setLoading(false);
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">⚙️ Settings</h1>
      <p className="text-gray-500 mt-2">
        Manage your contractor account and payment wallet.
      </p>

      <div className="bg-white rounded-xl shadow p-8 mt-8 max-w-3xl">
        <h2 className="text-xl font-bold mb-6">👤 Contractor Profile</h2>

        <div className="mb-5">
          <label className="text-sm text-gray-500">Company Name</label>
          <input
            value={contractor?.companyName || ""}
            disabled
            className="w-full border rounded-lg p-3 bg-gray-100 mt-2"
          />
        </div>

        <div className="mb-8">
          <label className="text-sm text-gray-500">Email</label>
          <input
            value={contractor?.email || ""}
            disabled
            className="w-full border rounded-lg p-3 bg-gray-100 mt-2"
          />
        </div>

        <hr className="mb-8" />

        <h2 className="text-xl font-bold mb-3">💳 Payment Wallet</h2>

        <p className="text-gray-500 mb-5">
          Your wallet is used for USDC payments and supplier transactions.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Connected Wallet</p>
            {walletConnected ? (
  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
    Connected
  </span>
) : (
  <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">
    Not Connected
  </span>
)}
          </div>

          <p className="font-mono mt-3 break-all text-sm">
            {contractor?.wallet || "No wallet connected"}
          </p>

          <p className="text-gray-500 text-sm mt-3">
            This wallet will receive and send USDC payments during
            procurement.
          </p>
        </div>

        <label className="text-sm text-gray-500">Change Wallet</label>

        <input
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Enter new wallet address"
          className="w-full border rounded-lg p-3 mt-2"
        />

        <button
          onClick={saveWallet}
          disabled={loading}
          className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? "Updating..." : "Update Wallet"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const userType = window.localStorage.getItem("userType");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            userType === "contractor" ? (
              <Navigate to="/dashboard" replace />
            ) : userType === "supplier" ? (
              <Navigate to="/supplier-dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route path="/register" element={<RegisterChoice />} />
        <Route path="/contractor-register" element={<ContractorRegister />} />
        <Route path="/supplier-register" element={<SupplierRegister />} />

        <Route element={<Layout />}>
          {/* Contractor routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/boq" element={<BOQ />} />
          <Route path="/contractor-orders" element={<ContractorOrders />} />
          <Route path="/suppliers" element={<TrustedSuppliers />} />
          <Route path="/history" element={<History />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Supplier routes */}
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
          <Route path="/supplier-earnings" element={<SupplierEarnings />} />
          <Route
            path="/supplier-trust-score"
            element={<SupplierTrustScore />}
          />
          <Route path="/supplier-materials" element={<SupplierMaterials />} />
          <Route
  path="/supplier-add-material/:id?"
  element={<SupplierAddMaterial />}
/>
          
          <Route path="/supplier-profile" element={<SupplierProfile />} />
          <Route path="/supplier-orders" element={<SupplierOrders />} />
        </Route>

        <Route path="/chat/:orderId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}