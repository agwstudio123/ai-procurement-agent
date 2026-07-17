import { FaBell, FaWallet, FaBars } from "react-icons/fa";

export default function Header({ setMenuOpen }) {

  return (

    <div className="
      flex 
      justify-between 
      items-center 
      mb-8 
      px-4 
      md:px-0
    ">


      <div className="flex items-center gap-3">


        {/* Mobile Menu Button */}

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

          <h1 className="
            text-2xl 
            md:text-3xl 
            font-bold 
            text-slate-800
          ">

            Dashboard

          </h1>


          <p className="
            text-slate-500 
            mt-1
            hidden
            sm:block
          ">

            AI-powered construction procurement

          </p>


        </div>


      </div>




      <div className="flex items-center gap-3">


        {/* Notification */}

        <button
          className="
            bg-white 
            shadow 
            rounded-xl 
            p-3 
            hover:shadow-lg
          "
        >

          <FaBell />

        </button>




        {/* Wallet */}

        <div
          className="
            bg-blue-600 
            text-white 
            rounded-xl 
            px-3 
            md:px-5 
            py-3 
            flex 
            items-center 
            gap-3 
            shadow-lg
          "
        >

          <FaWallet />


          <div className="hidden sm:block">

            <p className="text-xs">
              Wallet
            </p>


            <p className="font-bold">
              Connected
            </p>


          </div>


        </div>


      </div>


    </div>

  );

}