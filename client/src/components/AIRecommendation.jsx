export default function AIReport({
  totalOrders = 0,
  completedOrders = 0,
  pendingOrders = 0,
  totalPaid = 0,
  trustedSuppliers = 0,
}) {

  const safeTotalOrders = Number(totalOrders) || 0;
  const safeCompletedOrders = Number(completedOrders) || 0;
  const safePendingOrders = Number(pendingOrders) || 0;
  const safeTrustedSuppliers = Number(trustedSuppliers) || 0;


  const completionRate =
    safeTotalOrders === 0
      ? 0
      : Math.round(
          (safeCompletedOrders / safeTotalOrders) * 100
        );


  const score = Math.min(
    100,
    Math.round(
      completionRate * 0.6 +
      safeTrustedSuppliers * 20 +
      (safePendingOrders === 0 ? 20 : 10)
    )
  );


  const risk =
    safePendingOrders === 0
      ? "Low"
      : safePendingOrders <= 2
      ? "Medium"
      : "High";


  const supplierName =
    safeTrustedSuppliers > 0
      ? "TRUST SUPPLIER LIMITED"
      : "No Trusted Supplier";


  const wallet =
    "0x5542...a602";

  return (
    <div className="mt-8 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white shadow-xl overflow-hidden">

      <div className="p-8">

        <div className="flex justify-between items-center">

          <div>

            <h2 className="text-3xl font-bold">
              🤖 AI Procurement Report
            </h2>

            <p className="text-blue-200 mt-2">
              AI-generated procurement analysis based on your transaction history.
            </p>

          </div>

          <div className="text-center">

            <p className="text-sm uppercase tracking-widest text-blue-200">
              Procurement Score
            </p>

            <h1 className="text-6xl font-extrabold text-green-400">
              {score}/100
            </h1>

          </div>

        </div>


        <div className="grid md:grid-cols-2 gap-8 mt-10">

          <div className="bg-white/10 rounded-xl p-6">

            <h3 className="text-xl font-bold mb-5">
              📈 Key Insights
            </h3>

            <ul className="space-y-3">

              <li>✅ Total Orders: <strong>{safeTotalOrders}</strong></li>

              <li>✅ Completed Orders: <strong>{safeCompletedOrders}</strong></li>

              <li>⏳ Pending Orders: <strong>{safePendingOrders}</strong></li>

              <li>📊 Completion Rate: <strong>{completionRate}%</strong></li>

             <li>💰 Total Paid: <strong>{Number(totalPaid || 0).toFixed(5)} USDC</strong></li>

              <li>🤝 Trusted Suppliers: <strong>{safeTrustedSuppliers}</strong></li>

            </ul>

          </div>


          <div className="bg-white/10 rounded-xl p-6">

            <h3 className="text-xl font-bold mb-5">
              🏆 Best Performing Supplier
            </h3>

            <p className="mb-3">
              <strong>{supplierName}</strong>
            </p>

            <p className="mb-2">
              Wallet: {wallet}
            </p>

            <p className="mb-2">
              Trust Score: <span className="text-green-300 font-bold">95/100</span>
            </p>

            <p>
              Status:
              <span className="ml-2 bg-green-500 px-3 py-1 rounded-full text-sm">
                Verified & Trusted
              </span>
            </p>

          </div>

        </div>


        <div className="grid md:grid-cols-2 gap-8 mt-8">

          <div className="bg-blue-500/20 rounded-xl p-6">

            <h3 className="text-xl font-bold mb-4">
              🧠 AI Recommendation
            </h3>

            <p className="leading-8">

              Based on your procurement history, BuildProcure AI recommends
              continuing to source materials from <strong>{supplierName}</strong>.

              This supplier has demonstrated successful deliveries,
              completed payments and maintains a high trust score,
              making it a reliable procurement partner.

            </p>

          </div>


          <div className="bg-white/10 rounded-xl p-6">

            <h3 className="text-xl font-bold mb-4">
              ⚡ Risk Analysis
            </h3>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>Procurement Risk</span>
                <span className="font-bold text-green-300">
                  {risk}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Payment Reliability</span>
                <span className="font-bold text-green-300">
                  Excellent
                </span>
              </div>

              <div className="flex justify-between">
                <span>Supplier Diversity</span>
                <span className="font-bold text-yellow-300">
                  Medium
                </span>
              </div>

            </div>

          </div>

        </div>


        <div className="mt-8 bg-yellow-400/15 border border-yellow-300/20 rounded-xl p-6">

          <h3 className="text-xl font-bold mb-4">
            🚀 AI Optimization Opportunities
          </h3>

          <ul className="space-y-3">

            <li>✔ Reduce pending orders to improve procurement efficiency.</li>

            <li>✔ Add more verified suppliers to increase price competition.</li>

            <li>✔ Continue using USDC for transparent cross-border payments.</li>

            <li>✔ Compare quotations from multiple trusted suppliers before purchasing.</li>

          </ul>

        </div>

      </div>

    </div>
  );
}