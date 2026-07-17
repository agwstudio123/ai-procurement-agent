import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

export default function SupplierDashboard() {

  const [supplier, setSupplier] = useState(null);
  const [activeOrders, setActiveOrders] = useState(0);
  const [earnings, setEarnings] = useState(0);


  useEffect(() => {

    async function loadSupplier() {

      const supplierData = JSON.parse(
        localStorage.getItem("currentSupplier")
      );

      if (!supplierData) return;

      setSupplier(supplierData);


      try {

        const response = await fetch(
          `${API_URL}/orders`
        );

        const orders = await response.json();


        const supplierOrders = orders.filter(
          (order) =>
            Number(order.supplierId) === Number(supplierData.id)
        );


        const active = supplierOrders.filter(
          (order) =>
            order.status === "Pending" ||
            order.status === "Accepted"
        );


        setActiveOrders(active.length);



        const total = supplierOrders
          .filter(
            (order) =>
              order.status === "Completed" &&
              order.paymentStatus === "Paid"
          )
          .reduce(
            (sum, order) =>
              sum +
              Number(
                order.totalAmount ||
                order.amount ||
                0
              ),
            0
          );


        setEarnings(total);


      } catch(error){

        console.log(error);

      }

    }


    loadSupplier();


    const interval = setInterval(
      loadSupplier,
      5000
    );


    return () => clearInterval(interval);


  }, []);



  if(!supplier){

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

        <div className="bg-white rounded-xl shadow p-8 text-center">

          <h1 className="text-2xl font-bold">
            No Supplier Account Found
          </h1>


          <Link
            to="/supplier-register"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Register Supplier
          </Link>

        </div>

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-gray-100 p-4 md:p-10">


      {/* HEADER */}

      <div className="flex flex-col md:flex-row justify-between gap-5">


        <div>

          <h1 className="text-2xl md:text-3xl font-bold">

            🚚 Welcome {supplier.companyName}

          </h1>


          <p className="text-gray-600 mt-2">

            Manage your materials, orders and payments.

          </p>


        </div>



        <button

          onClick={() => {

            localStorage.removeItem("userType");
            localStorage.removeItem("currentSupplier");

            window.location.href="/";

          }}

          className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold w-full md:w-auto"

        >

          Logout

        </button>


      </div>





      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">


        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-500">
            Materials Listed
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {supplier.materials?.length || 0}
          </h2>

        </div>




        <Link
          to="/supplier-orders"
          className="bg-white rounded-xl shadow p-6 hover:bg-blue-50"
        >

          <p className="text-gray-500">
            Active Orders
          </p>


          <h2 className="text-3xl font-bold mt-2 text-blue-600">
            {activeOrders}
          </h2>


          <p className="text-blue-600 mt-2">
            View Orders →
          </p>

        </Link>





        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-500">
            Earnings
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {earnings.toFixed(2)} USDC
          </h2>

        </div>





        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-500">
            Trust Score
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ⭐ {supplier.trustScore || 95}
          </h2>

        </div>


      </div>





      {/* PROFILE */}

      <div className="bg-white rounded-xl shadow p-5 md:p-6 mt-8">


        <div className="flex flex-col sm:flex-row justify-between gap-3">


          <h2 className="text-xl font-bold">
            Company Profile
          </h2>


          <Link
            to="/supplier-profile"
            className="text-blue-600 font-semibold"
          >

            ✏️ Edit Profile

          </Link>


        </div>


        <div className="space-y-3 mt-5 break-words">


          <p>
            <strong>Company:</strong> {supplier.companyName}
          </p>


          <p>
            <strong>Owner:</strong> {supplier.ownerName}
          </p>


          <p>
            <strong>Location:</strong> {supplier.location}
          </p>


          <p>
            <strong>Wallet:</strong> {supplier.wallet}
          </p>


        </div>


      </div>





      {/* MATERIALS */}

      <div className="bg-white rounded-xl shadow p-5 md:p-6 mt-8">


        <div className="flex flex-col sm:flex-row justify-between gap-4">


          <h2 className="text-xl font-bold">
            My Materials
          </h2>


          <Link
            to="/supplier-materials"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg text-center"
          >

            Manage Materials

          </Link>


        </div>




        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">


          {supplier.materials?.map((item)=>(


            <div
              key={item.id}
              className="border rounded-xl p-4"
            >

              <h3 className="text-lg font-bold">
                {item.name}
              </h3>


              <p>
                {item.quantity} {item.unit}
              </p>


              <p className="font-semibold text-blue-600">
                {item.price} USDC
              </p>


              <p className="mt-3 text-green-600 font-semibold">
                ✅ Available
              </p>


            </div>


          ))}


        </div>


      </div>



    </div>

  );

}