export default function AIReport({
  totalOrders = 0,
  completedOrders = 0,
  pendingOrders = 0,
  totalPaid = 0,
  trustedSuppliers = 0,
  supplierResult = null,
}) {


  const score = Math.min(
    100,
    completedOrders * 20 + trustedSuppliers * 10
  );



  // Get supplier from BOQ AI recommendation
  const bestSupplier =
    supplierResult?.supplier?.name ||
    (trustedSuppliers > 0
      ? "TRUST SUPPLIER LIMITED"
      : "No Trusted Supplier");



  const supplierCost =
    supplierResult?.supplier?.totalCost || 0;



  const supplierWallet =
    supplierResult?.supplier?.walletAddress || "No wallet";



  return (
    <div className="mt-8 bg-white rounded-xl shadow p-8">


      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          🤖 AI Procurement Report
        </h2>


        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
          AI Generated
        </span>

      </div>





      <div className="grid md:grid-cols-2 gap-6 mt-8">


        {/* BEST SUPPLIER */}

        <div className="bg-green-50 rounded-xl p-5">

          <p className="text-gray-500">
            Best Supplier
          </p>


          <h3 className="text-2xl font-bold mt-2 text-green-700">
            {bestSupplier}
          </h3>


        </div>






        {/* PROCUREMENT VALUE */}

        <div className="bg-blue-50 rounded-xl p-5">

          <p className="text-gray-500">
            Recommended Procurement Cost
          </p>


          <h3 className="text-2xl font-bold mt-2 text-blue-700">

            {Number(
              supplierCost || totalPaid || 0
            ).toFixed(5)} USDC

          </h3>


        </div>






        {/* TRUSTED SUPPLIERS */}

        <div className="bg-purple-50 rounded-xl p-5">

          <p className="text-gray-500">
            Trusted Suppliers
          </p>


          <h3 className="text-2xl font-bold mt-2 text-purple-700">

            {trustedSuppliers}

          </h3>


        </div>






        {/* SUCCESSFUL PAYMENTS */}

        <div className="bg-yellow-50 rounded-xl p-5">

          <p className="text-gray-500">
            Successful Payments
          </p>


          <h3 className="text-2xl font-bold mt-2 text-yellow-700">

            {completedOrders}

          </h3>


        </div>


      </div>






      {/* SUPPLIER DETAILS */}

      <div className="mt-8 bg-gray-50 rounded-xl p-6">


        <h3 className="font-bold text-lg mb-3">

          🏆 Supplier Details

        </h3>



        <p className="mb-2">

          Supplier:
          <strong>
            {" "}
            {bestSupplier}
          </strong>

        </p>



        <p className="mb-2">

          Wallet:
          <strong>
            {" "}
            {supplierWallet}
          </strong>

        </p>



        <p>

          AI Score:
          <strong>
            {" "}
            {score}/100
          </strong>

        </p>


      </div>







      {/* AI RECOMMENDATION */}

      <div className="mt-8 border-l-4 border-blue-500 bg-blue-50 p-6 rounded">


        <h3 className="font-bold text-lg mb-3">

          AI Recommendation

        </h3>



        <p className="text-gray-700 leading-7">


          {supplierResult?.supplier

            ? `${bestSupplier} was selected by BuildProcure AI as the best supplier based on material pricing, supplier trust score, and availability. The recommended procurement cost is ${supplierCost} USDC.`

            :

            "No procurement recommendation available yet. Submit a Bill of Quantities to allow AI to analyze suppliers."

          }


        </p>


      </div>



    </div>
  );
}