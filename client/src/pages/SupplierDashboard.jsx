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
            Number(order.supplierId) ===
            Number(supplierData.id)
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



      } catch (error) {

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



  if (!supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">

          <h1 className="text-2xl font-bold">
            No Supplier Account Found
          </h1>


          <p className="mt-3 text-gray-600">
            Please register as a supplier first.
          </p>


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

    <div className="min-h-screen bg-gray-100 p-10">


      <div className="flex justify-between items-start">

        <div>

          <h1 className="text-3xl font-bold">
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

            window.location.href = "/";

          }}

          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold"

        >

          Logout

        </button>


      </div>





      <div className="grid md:grid-cols-4 gap-6 mt-8">


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

          className="bg-white rounded-xl shadow p-6 hover:bg-blue-50 transition"

        >

          <p className="text-gray-500">
            Active Orders
          </p>


          <h2 className="text-3xl font-bold mt-2 text-blue-600">
            {activeOrders}
          </h2>


          <p className="text-sm text-blue-600 mt-2">
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






      <div className="bg-white rounded-xl shadow p-6 mt-8">


        <div className="flex justify-between items-center">


          <h2 className="text-xl font-bold">
            Company Profile
          </h2>



          <Link
            to="/supplier-profile"
            className="text-blue-600 font-semibold hover:underline"
          >

            ✏️ Edit Profile

          </Link>


        </div>




        <div className="space-y-3 mt-5">


          <p>
            <strong>Company:</strong>{" "}
            {supplier.companyName}
          </p>


          <p>
            <strong>Owner:</strong>{" "}
            {supplier.ownerName}
          </p>


          <p>
            <strong>Location:</strong>{" "}
            {supplier.location}
          </p>


          <p>
            <strong>Wallet:</strong>{" "}
            {supplier.wallet}
          </p>


          <p>
            <strong>Materials Category:</strong>{" "}
            {supplier.categories}
          </p>


        </div>


      </div>






      <div className="bg-white rounded-xl shadow p-6 mt-8">


        <div className="flex justify-between items-center">


          <h2 className="text-xl font-bold">
            My Materials
          </h2>



          <Link

            to="/supplier-materials"

            className="bg-blue-600 text-white px-5 py-2 rounded-lg"

          >

            Manage Materials

          </Link>


        </div>





        {supplier.materials?.length === 0 ? (

          <div className="text-center py-10 text-gray-500">

            No materials added yet.

          </div>


        ) : (


          <div className="grid md:grid-cols-3 gap-5 mt-6">


            {supplier.materials.map((item) => (


              <div

                key={item.id}

                className="border rounded-xl p-4"

              >


                <h3 className="text-lg font-bold">
                  {item.name}
                </h3>



                <p className="mt-2">
                  {item.quantity} {item.unit}
                </p>



                <p className="font-semibold text-blue-600">
                  {item.price} USDC
                </p>



                <div className="mt-3 text-green-600 font-semibold">

                  ✅ Available

                </div>



              </div>


            ))}


          </div>


        )}


      </div>


    </div>

  );

}