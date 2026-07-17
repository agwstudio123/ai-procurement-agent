import { useState, useEffect } from "react";

import StatsCard from "../components/StatsCard";
import SupplierTable from "../components/SupplierTable";
import AIReport from "../components/AIRecommendation";
import BOQForm from "../components/BOQForm";

import { API_URL } from "../api";


export default function Dashboard() {

  const [result, setResult] = useState(null);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [contractor, setContractor] = useState(null);


  useEffect(() => {

    fetch(`${API_URL}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.log(err));


    fetch(`${API_URL}/suppliers`)
      .then((res) => res.json())
      .then((data) => setSuppliers(data))
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
        Number(order.contractorId) === Number(contractor?.id) &&
        order.status === "Completed" &&
        order.paymentStatus === "Paid"
    )
    .reduce(
      (sum, order) =>
        sum + Number(order.savings || 0),
      0
    );


  const trustedSuppliers = suppliers.filter(
    (supplier) => supplier.trusted === true
  ).length;


  const walletConnected = !!contractor?.wallet;


  return (

    <div className="p-4 md:p-8 w-full overflow-x-hidden">


      {/* Stats */}

      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        xl:grid-cols-4 
        gap-4 
        md:gap-6 
        mt-6
      ">


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



      {/* BOQ */}

      <div className="mt-6 md:mt-8">

        <BOQForm
          onResult={(data) => {
            setResult(data);
          }}
        />

      </div>



      {/* AI Report */}

      <div className="mt-6 md:mt-8">

        <AIReport
          totalOrders={totalOrders}
          completedOrders={completedOrders}
          pendingOrders={pendingOrders}
          totalPaid={totalPaid}
          trustedSuppliers={trustedSuppliers}
          supplierResult={result}
        />

      </div>



      {/* Selected Supplier */}

      <div className="mt-6 md:mt-8">


        {result?.supplier && (

          <div className="
            bg-white 
            rounded-xl 
            shadow 
            p-4 
            md:p-6
          ">


            <h2 className="
              text-xl 
              md:text-2xl 
              font-bold 
              mb-4
            ">

              🤖 AI Selected Supplier

            </h2>



            <div className="space-y-3 text-sm md:text-base">


              <p>
                <strong>Supplier:</strong>{" "}
                {result.supplier.name}
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



      {/* Suppliers */}

      <div className="
        mt-6 
        md:mt-8 
        overflow-x-auto 
        rounded-xl
      ">

        <SupplierTable />

      </div>



    </div>

  );

}