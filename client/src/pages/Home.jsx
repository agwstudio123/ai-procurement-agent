import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();


  const chooseRole = (role) => {

    localStorage.setItem(
      "userType",
      role
    );


    if(role === "contractor"){
      navigate("/dashboard");
    }


    if(role === "supplier"){
      navigate("/supplier-register");
    }

  };


  return (

    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold mb-4">
        🚚 BuildProcure
      </h1>


      <p className="text-gray-600 mb-10">
        AI-powered construction procurement
      </p>



      <h2 className="text-2xl font-semibold mb-6">
        Who are you?
      </h2>



      <div className="flex gap-8">


        {/* Contractor Card */}

        <button
          onClick={() => chooseRole("contractor")}
          className="bg-white shadow-lg rounded-xl p-8 w-72 hover:scale-105 transition"
        >

          <div className="text-5xl mb-4">
            👷
          </div>


          <h3 className="text-xl font-bold">
            Contractor
          </h3>


          <p className="text-gray-500 mt-3">
            Find materials, compare suppliers,
            and pay using USDC.
          </p>


        </button>




        {/* Supplier Card */}

        <button
          onClick={() => chooseRole("supplier")}
          className="bg-white shadow-lg rounded-xl p-8 w-72 hover:scale-105 transition"
        >

          <div className="text-5xl mb-4">
            🏭
          </div>


          <h3 className="text-xl font-bold">
            Supplier
          </h3>


          <p className="text-gray-500 mt-3">
            List materials, set prices,
            and receive payments.
          </p>


        </button>


      </div>


    </div>

  );
}