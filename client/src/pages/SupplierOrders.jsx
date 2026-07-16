import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

export default function SupplierOrders() {
  const [orders, setOrders] = useState([]);
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  async function loadOrders() {
    const currentSupplier = JSON.parse(
      localStorage.getItem("currentSupplier")
    );

    if (!currentSupplier) return;

    setSupplier(currentSupplier);

    try {
      const response = await fetch(
        `${API_URL}/orders`
      );

      const allOrders = await response.json();

      const supplierOrders = allOrders.filter(
        (order) =>
          Number(order.supplierId) === Number(currentSupplier.id) &&
          order.status !== "Completed" &&
          order.status !== "Rejected"
      );

      setOrders(supplierOrders);

    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  }


  async function updateStatus(orderId, newStatus) {
    try {
      const response = await fetch(
        `${API_URL}/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );


      const data = await response.json();


      if (!data.success) {
        alert("Failed to update order.");
        return;
      }


      loadOrders();


    } catch (error) {
      console.error(error);
      alert("Backend connection failed.");
    }
  }



  if (!supplier) {
    return (
      <div className="p-10">
        Supplier not found.
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold">
        📦 Incoming Orders
      </h1>


      <p className="text-gray-600 mt-2">
        Orders waiting for your action.
      </p>



      {orders.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-8 mt-8 text-center">

          <h2 className="text-2xl font-bold">
            No Orders Yet
          </h2>


          <p className="text-gray-500 mt-3">
            Contractor requests will appear here.
          </p>


        </div>


      ) : (


        <div className="grid gap-6 mt-8">


          {orders.map((order)=>(


            <div
              key={order.id}
              className="bg-white rounded-xl shadow p-6"
            >


              <div className="flex justify-between">


                <div>


                  <h2 className="text-xl font-bold">
                    {order.contractorName}
                  </h2>



                  <p className="mt-2">
                    Amount:
                    <strong>
                      {" "}
                      {order.totalAmount || order.amount} USDC
                    </strong>
                  </p>



                  <p className="mt-2">
                    Payment:
                    <strong>
                      {" "}
                      {order.paymentStatus || "Unpaid"}
                    </strong>
                  </p>



                  {order.transactionId && (

                    <p className="mt-2 text-sm break-all">
                      Transaction ID:
                      <br />
                      {order.transactionId}
                    </p>

                  )}



                  <p className="mt-2 text-sm break-all">

                    Wallet:
                    <br />

                    {order.supplierWallet || "Not Connected"}

                  </p>



                  <p className="mt-2 text-gray-500">

                    {new Date(order.createdAt).toLocaleString()}

                  </p>


                </div>



                <span
                  className={`px-4 py-2 rounded-full font-bold h-fit ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Accepted"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "Payment Secured"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Dispatched"
                      ? "bg-indigo-100 text-indigo-700"
                      : order.status === "Delivered"
                      ? "bg-purple-100 text-purple-700"
                      : order.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >

                  {order.status}

                </span>


              </div>




              <Link
                to={`/chat/${order.id}`}
                className="mt-6 inline-block bg-purple-600 text-white px-5 py-2 rounded-lg"
              >

                💬 Chat Contractor

              </Link>





              {order.status === "Pending" && (

                <div className="flex gap-4 mt-4">


                  <button
                    onClick={() =>
                      updateStatus(order.id,"Accepted")
                    }
                    className="bg-green-600 text-white px-5 py-2 rounded-lg"
                  >

                    ✅ Accept Order

                  </button>



                  <button
                    onClick={() =>
                      updateStatus(order.id,"Rejected")
                    }
                    className="bg-red-600 text-white px-5 py-2 rounded-lg"
                  >

                    ❌ Reject

                  </button>


                </div>

              )}





              {order.status === "Payment Secured" && (

                <div className="mt-4">


                  <p className="text-green-600 font-bold mb-3">

                    🔒 Payment Secured

                  </p>



                  <button
                    onClick={() =>
                      updateStatus(order.id,"Dispatched")
                    }
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                  >

                    🚚 Dispatch Materials

                  </button>


                </div>

              )}





              {order.status === "Dispatched" && (

                <button
                  onClick={() =>
                    updateStatus(order.id,"Delivered")
                  }
                  className="bg-green-600 text-white px-5 py-2 rounded-lg mt-4"
                >

                  📦 Mark as Delivered

                </button>

              )}





              {order.status === "Delivered" && (

                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-300">

                  <p className="font-semibold text-yellow-800">

                    ⏳ Waiting for contractor confirmation.

                  </p>


                  <p className="text-sm text-yellow-700 mt-1">

                    Payment is safely held in escrow and will be released after the contractor confirms delivery.

                  </p>


                </div>

              )}





              {order.status === "Completed" && (

                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-300">

                  <p className="font-bold text-green-700">

                    💰 Payment Released

                  </p>


                  <p className="text-sm text-green-600">

                    Funds have been released to your wallet.

                  </p>


                </div>

              )}



            </div>


          ))}


        </div>


      )}


    </div>
  );
}