import PayButton from "./PayButton";

export default function AIRecommendation({ result }) {
  console.log("AI CARD RESULT:", result);

  if (!result) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold">
          🤖 AI Recommendation
        </h2>

        <p className="text-gray-500 mt-6">
          Submit your BOQ to get AI supplier recommendation.
        </p>
      </div>
    );
  }

const supplierData = {
  id: result.id,
  companyName: result.name,
  wallet: result.walletAddress || "",
  totalCost: result.price,
  trusted: result.trusted,
};

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold">
        🤖 AI Recommendation
      </h2>

      <div className="mt-6">
        <p className="text-gray-500">
          Recommended Supplier
        </p>

        <h3 className="text-2xl font-bold mt-2">
          {supplierData.companyName}
        </h3>

        {supplierData.trusted && (
          <p className="mt-4 text-green-600 font-semibold">
            Trusted Supplier ✅
          </p>
        )}

        <p className="mt-3">
          Total Cost
        </p>

        <p className="text-2xl font-bold text-blue-600">
          {supplierData.totalCost} USDC
        </p>

        <div className="mt-5 bg-blue-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">
            Supplier Wallet
          </p>

          <p className="text-xs break-all">
            {supplierData.wallet}
          </p>
        </div>

        <PayButton supplier={supplierData} />
      </div>
    </div>
  );
}