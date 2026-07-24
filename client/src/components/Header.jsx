import { FaBell, FaWallet, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../api";

export default function Header({ setMenuOpen }) {
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    const supplier = JSON.parse(
      localStorage.getItem("currentSupplier")
    );

    const contractor = JSON.parse(
      localStorage.getItem("currentContractor")
    );

    const user = supplier || contractor;

    if (!user) return;

    async function loadNotifications() {
      try {
        const response = await fetch(
          `${API_URL}/notifications/${user.id}`
        );

        const data = await response.json();

        setUnreadCount(
          data.filter((notification) => !notification.read).length
        );

      } catch (error) {
        console.error(error);
      }
    }

    function checkWallet() {
      if (
        user.wallet &&
        user.wallet !== "Not Connected"
      ) {
        setWalletConnected(true);
      } else {
        setWalletConnected(false);
      }
    }

    loadNotifications();
    checkWallet();

    const notificationInterval = setInterval(
      loadNotifications,
      5000
    );

    const walletInterval = setInterval(
      checkWallet,
      10000
    );

    return () => {
      clearInterval(notificationInterval);
      clearInterval(walletInterval);
    };

  }, []);

  return (
    <div
      className="
        flex
        justify-between
        items-center
        mb-8
        px-4
        md:px-0
      "
    >
      <div className="flex items-center gap-3">

        <button
          onClick={() => setMenuOpen(true)}
          className="
            md:hidden
            bg-white
            shadow
            rounded-xl
            p-3
          "
        >
          <FaBars />
        </button>

        <div>
          <h1
            className="
              text-2xl
              md:text-3xl
              font-bold
              text-slate-800
            "
          >
            Dashboard
          </h1>

          <p
            className="
              text-slate-500
              mt-1
              hidden
              sm:block
            "
          >
            AI-powered construction procurement
          </p>
        </div>

      </div>

      <div className="flex items-center gap-3">

        <button
          onClick={() => navigate("/notifications")}
          className="
            relative
            bg-white
            shadow
            rounded-xl
            p-3
            hover:shadow-lg
            hover:bg-gray-100
            transition
          "
        >
          <FaBell size={18} />

          {unreadCount > 0 && (
            <span
              className="
                absolute
                -top-2
                -right-2
                bg-red-600
                text-white
                text-xs
                rounded-full
                h-5
                w-5
                flex
                items-center
                justify-center
                font-bold
              "
            >
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate("/wallet")}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            rounded-xl
            px-3
            md:px-5
            py-3
            flex
            items-center
            gap-3
            shadow-lg
            transition
          "
        >
          <FaWallet />

          <div className="hidden sm:block text-left">
            <p className="text-xs">
              Wallet
            </p>

            <p className="font-bold">
              {walletConnected
                ? "Connected"
                : "Connect Wallet"}
            </p>
          </div>

        </button>

      </div>
    </div>
  );
}