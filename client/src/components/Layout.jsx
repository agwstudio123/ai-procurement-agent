import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import background from "../assets/background.png";

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main
        className="flex-1 overflow-y-auto"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}