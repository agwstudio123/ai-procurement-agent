import { useState } from "react";

import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import SupplierChart from "../components/SupplierChart";
import SupplierTable from "../components/SupplierTable";
import AIRecommendation from "../components/AIRecommendation";
import BOQForm from "../components/BOQForm";


export default function Dashboard() {

  const [result, setResult] = useState(null);


  return (
    <div className="flex bg-gray-100 min-h-screen">


      


      {/* Main Dashboard */}
      <main className="flex-1 p-8">


        <Header />



        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mt-8">


          <StatsCard
            title="Wallet Balance"
            value="27 USDC"
            color="bg-blue-600"
          />


          <StatsCard
            title="Trusted Suppliers"
            value="12"
            color="bg-green-600"
          />


          <StatsCard
            title="Active Projects"
            value="8"
            color="bg-purple-600"
          />


          <StatsCard
            title="Money Saved"
            value="205 USDC"
            color="bg-orange-500"
          />


        </div>




        {/* BOQ FORM */}
        <div className="mt-8">

          <BOQForm 
            onResult={(data)=>{
              console.log("FROM BOQ TO DASHBOARD:", data);
              setResult(data);
            }}
          />

        </div>





        {/* Chart + AI Recommendation */}
        <div className="grid grid-cols-3 gap-6 mt-8">


          <div className="col-span-2">

            <SupplierChart />

          </div>



          <AIRecommendation 
            result={result}
          />


        </div>





        {/* Supplier Comparison */}
        <div className="mt-8">

          <SupplierTable />

        </div>



      </main>


    </div>
  );
}