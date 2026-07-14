import { useNavigate } from "react-router-dom";

export default function RegisterChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-2xl">

        <h1 className="text-3xl font-bold text-center">
          Create Your BuildProcure Account
        </h1>

        <p className="text-gray-600 text-center mt-3">
          Select the type of account you want to create.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <button
            onClick={() => navigate("/contractor-register")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-8 transition"
          >
            <h2 className="text-2xl font-bold">
              🏗 Contractor
            </h2>

            <p className="mt-3">
              Purchase materials, compare suppliers and manage construction procurement.
            </p>
          </button>

          <button
            onClick={() => navigate("/supplier-register")}
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-8 transition"
          >
            <h2 className="text-2xl font-bold">
              🚚 Supplier
            </h2>

            <p className="mt-3">
              Sell construction materials, receive orders and accept USDC payments.
            </p>
          </button>

        </div>

      </div>

    </div>
  );
}