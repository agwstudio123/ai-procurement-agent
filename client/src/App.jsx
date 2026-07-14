import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";

import Login from "./pages/Login";
import RegisterChoice from "./pages/RegisterChoice";
import ContractorRegister from "./pages/ContractorRegister";
import SupplierRegister from "./pages/SupplierRegister";

import Dashboard from "./pages/Dashboard";
import BOQ from "./pages/BOQ";

import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierMaterials from "./pages/SupplierMaterials";
import SupplierAddMaterial from "./pages/SupplierAddMaterial";
import SupplierProfile from "./pages/SupplierProfile";
import SupplierOrders from "./pages/SupplierOrders";
import ContractorOrders from "./pages/ContractorOrders";

import Chat from "./pages/Chat";


function Suppliers() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Trusted Suppliers
      </h1>

      <p className="mt-4 text-gray-600">
        AI verified suppliers will appear here.
      </p>
    </div>
  );
}


function History() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Procurement History
      </h1>

      <p className="mt-4">
        Completed purchases and payments.
      </p>
    </div>
  );
}


function Payments() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Payments
      </h1>

      <p className="mt-4">
        USDC transactions will appear here.
      </p>
    </div>
  );
}


function Analytics() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Analytics
      </h1>
    </div>
  );
}


function Settings() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Settings
      </h1>
    </div>
  );
}


console.log("THIS IS THE NEW CHAT PAGE");


export default function App() {

  const userType = window.localStorage.getItem("userType");

  console.log("APP USER TYPE:", userType);


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


        <Route
          path="/register"
          element={<RegisterChoice />}
        />


        <Route
          path="/contractor-register"
          element={<ContractorRegister />}
        />


        <Route
          path="/supplier-register"
          element={<SupplierRegister />}
        />


        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/boq"
            element={<BOQ />}
          />

          <Route
            path="/contractor-orders"
            element={<ContractorOrders />}
          />

          <Route
            path="/suppliers"
            element={<Suppliers />}
          />

          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/payments"
            element={<Payments />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>


        <Route
          path="/supplier-dashboard"
          element={<SupplierDashboard />}
        />


        <Route
          path="/supplier-materials"
          element={<SupplierMaterials />}
        />


        <Route
          path="/supplier-add-material"
          element={<SupplierAddMaterial />}
        />


        <Route
          path="/supplier-profile"
          element={<SupplierProfile />}
        />


        <Route
          path="/supplier-orders"
          element={<SupplierOrders />}
        />


        <Route
          path="/chat/:orderId"
          element={<Chat />}
        />


      </Routes>

    </BrowserRouter>
  );
}