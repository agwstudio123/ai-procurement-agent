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
  FaBell,
  FaBoxes,
  FaMoneyBill,
  FaStar,
  FaTimes,
} from "react-icons/fa";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { useEffect, useState } from "react";

import { API_URL } from "../api";
import AIAssistant from "./AIAssistant";


export default function Sidebar({ menuOpen, setMenuOpen }) {

  const location = useLocation();

  const [notifications, setNotifications] = useState([]);


  const userType = localStorage.getItem("userType");


  const supplier =
    JSON.parse(localStorage.getItem("currentSupplier"));


  const contractor =
    JSON.parse(localStorage.getItem("currentContractor"));



  const unreadCount =
    notifications.filter((n)=>!n.read).length;



  useEffect(()=>{

    const user = supplier || contractor;

    if(!user) return;


    async function loadNotifications(){

      try{

        const response =
          await fetch(
            `${API_URL}/notifications/${user.id}`
          );


        const data =
          await response.json();


        setNotifications(data);


      }catch(err){

        console.log(err);

      }

    }


    loadNotifications();


    const interval =
      setInterval(loadNotifications,1000);


    return ()=>clearInterval(interval);


  },[]);



  function logout(){

    localStorage.removeItem("userType");
    localStorage.removeItem("currentSupplier");
    localStorage.removeItem("currentContractor");

    window.location.href="/";

  }




  const contractorMenu=[

    {icon:<FaHome/>,label:"Dashboard",path:"/dashboard"},

    {icon:<FaClipboardList/>,label:"Bill of Quantities",path:"/boq"},

    {icon:<FaBox/>,label:"My Orders",path:"/contractor-orders"},

    {icon:<FaTruck/>,label:"Suppliers",path:"/suppliers"},

    {
      icon:<FaBell/>,
      label:`Notifications (${unreadCount})`,
      path:"/notifications"
    },

    {icon:<FaHistory/>,label:"Procurement History",path:"/history"},

    {icon:<FaWallet/>,label:"Payments",path:"/payments"},

    {icon:<FaChartBar/>,label:"Analytics",path:"/analytics"},

    {icon:<FaCog/>,label:"Settings",path:"/settings"},

  ];



  const supplierMenu=[

    {icon:<FaHome/>,label:"Dashboard",path:"/supplier-dashboard"},

    {icon:<FaBox/>,label:"My Orders",path:"/supplier-orders"},

    {icon:<FaBoxes/>,label:"My Materials",path:"/supplier-materials"},

    {
      icon:<FaBell/>,
      label:`Notifications (${unreadCount})`,
      path:"/notifications"
    },

    {icon:<FaMoneyBill/>,label:"Earnings",path:"/supplier-earnings"},

    {icon:<FaStar/>,label:"Trust Score",path:"/supplier-trust-score"},

    {icon:<FaCog/>,label:"Settings",path:"/supplier-profile"},

  ];



  const menu =
    userType==="supplier"
    ? supplierMenu
    : contractorMenu;



  return (

    <>


      {/* MOBILE OVERLAY */}

      {menuOpen && (

        <div
          onClick={()=>setMenuOpen(false)}
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            md:hidden
          "
        />

      )}




      <aside

        className={`
          fixed
          top-0
          left-0
         + min-h-screen
          w-72
          bg-slate-950
          text-white
          flex
          flex-col
          shadow-lg
          z-50

          transform
          transition-transform
          duration-300

          ${menuOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }

          md:static
          md:translate-x-0
        `}

      >



        <div className="
          p-5 md:p-8
          border-b
          border-slate-800
          flex
          justify-between
          items-center
        ">


          <h1 className="text-xl md:text-2xl font-bold">
            🏗 BuildProcure AI
          </h1>



          <button
            onClick={()=>setMenuOpen(false)}
            className="md:hidden"
          >

            <FaTimes size={22}/>

          </button>


        </div>



        <div className="flex-1 mt-4 overflow-y-auto">


          {menu.map((item)=>(


            <Link

              key={item.path}

              to={item.path}

              onClick={()=>setMenuOpen(false)}

              className={`

                flex
                items-center
                gap-4
                px-8
                py-4
                transition

                ${
                  location.pathname===item.path
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
                }

              `}

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




        <div className="
          p-4
          md:p-6
          border-t
          border-slate-800
        ">


          <button

            onClick={logout}

            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-red-600
              hover:bg-red-700
              py-3
              rounded-lg
              font-bold
            "

          >

            <FaSignOutAlt/>

            Logout


          </button>


        </div>




        <AIAssistant/>


      </aside>


    </>

  );

}