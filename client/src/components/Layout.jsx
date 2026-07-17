import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import background from "../assets/background.png";

export default function Layout() {

  const [menuOpen, setMenuOpen] = useState(false);


  return (

    <div className="flex min-h-screen h-screen">


      <Sidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />


      <main
        className="flex-1 overflow-y-auto w-full"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >

        <Header
          setMenuOpen={setMenuOpen}
        />


        <Outlet />

      </main>


    </div>

  );

}