import { FaBell, FaWallet } from "react-icons/fa";

export default function Header() {
  return (
    <div className="flex justify-between items-center mb-8">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          AI-powered construction procurement
        </p>
      </div>

      <div className="flex items-center gap-4">

        <button className="bg-white shadow rounded-xl p-3 hover:shadow-lg">
          <FaBell />
        </button>

        <div className="bg-blue-600 text-white rounded-xl px-5 py-3 flex items-center gap-3 shadow-lg">
          <FaWallet />
          <div>
            <p className="text-xs">Wallet</p>
            <p className="font-bold">Connected</p>
          </div>
        </div>

      </div>

    </div>
  );
}