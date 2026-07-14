import {
  FaHome,
  FaClipboardList,
  FaTruck,
  FaBox,
  FaHistory,
  FaWallet,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import {
  Link,
  useLocation,
} from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  function logout() {
    

    localStorage.removeItem("userType");
    localStorage.removeItem("currentSupplier");
    localStorage.removeItem("currentContractor");

    

    window.location.href = "/";
  }

  const menu = [
    {
      icon: <FaHome />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <FaClipboardList />,
      label: "Bill of Quantities",
      path: "/boq",
    },
    {
      icon: <FaBox />,
      label: "My Orders",
      path: "/contractor-orders",
    },
    {
      icon: <FaTruck />,
      label: "Suppliers",
      path: "/suppliers",
    },
    {
      icon: <FaHistory />,
      label: "Procurement History",
      path: "/history",
    },
    {
      icon: <FaWallet />,
      label: "Payments",
      path: "/payments",
    },
    {
      icon: <FaChartBar />,
      label: "Analytics",
      path: "/analytics",
    },
    {
      icon: <FaCog />,
      label: "Settings",
      path: "/settings",
    },
  ];

  return (
    <div className="w-72 bg-slate-950 text-white min-h-screen flex flex-col">

      <div className="p-8 border-b border-slate-800">
        <h1 className="text-2xl font-bold">
          🏗 BuildProcure AI
        </h1>

        <p className="text-sm text-slate-400 mt-2">
          AI Construction Procurement
        </p>
      </div>

      <div className="flex-1 mt-6">
        {menu.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-4 px-8 py-4 transition-all ${
              location.pathname === item.path
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      <div className="p-6 border-t border-slate-800">

        <div className="rounded-xl bg-blue-600 p-4">
          <h2 className="font-bold">
            🤖 AI Assistant
          </h2>

          <p className="text-sm mt-2 text-blue-100">
            Ask anything about suppliers,
            procurement or market prices.
          </p>

          <button className="mt-4 bg-white text-blue-600 rounded-lg w-full py-2 font-semibold hover:bg-gray-100 transition">
            Chat with AI
          </button>
        </div>


        <button
          onClick={logout}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-lg font-bold"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </div>
  );
}