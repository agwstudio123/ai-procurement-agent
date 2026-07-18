import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import background from "../assets/background.png";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {/* Main Content */}
      <main
        className="
          min-h-screen
          overflow-y-auto
          transition-all
          duration-300
          md:ml-72
        "
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Header setMenuOpen={setMenuOpen} />

        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}