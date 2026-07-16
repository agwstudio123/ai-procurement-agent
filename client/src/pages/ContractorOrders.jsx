import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

export default function ContractorOrders() {

  const [orders, setOrders] = useState([]);


  async function loadOrders() {

    const contractor = JSON.parse(
      localStorage.getItem("currentContractor")
    );

    if (!contractor) return;


    try {

      const response = await fetch(
        `${API_URL}/orders`
      );

      const allOrders = await response.json();


      setOrders(
        allOrders.filter(
          (order) =>
            Number(order.contractorId) ===
            Number(contractor.id)
        )
      );


    } catch (error) {

      console.log(
        "Failed to load orders:",
        error
      );

    }

  }



  useEffect(() => {

    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 3000);


    return () => clearInterval(interval);

  }, []);




  async function paySupplier(orderId) {

    try {

      const response = await fetch(
        `${API_URL}/orders/${orderId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: "Payment Secured",
            paymentStatus: "Escrowed",
          })
        }
      );


      const data = await response.json();


      if (!data.success) {

        alert("Payment failed");
        return;

      }


      loadOrders();


    } catch (error) {

      console.log(error);
      alert("Backend connection failed");

    }

  }





  async function confirmDelivery(orderId) {

    try {

      const response = await fetch(
        `${API_URL}/orders/${orderId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: "Completed",
            paymentStatus: "Paid",
          }),

        }
      );


      const data = await response.json();


      if (!data.success) {

        alert("Failed to complete order");
        return;

      }


      loadOrders();


    } catch (error) {

      console.log(error);
      alert("Backend connection failed");

    }

  }





  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold">
        🏗 My Procurement Orders
      </h1>


      <p className="text-gray-600 mt-2">
        Track all supplier orders.
      </p>



      {orders.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-10 mt-8 text-center">

          <h2 className="text-2xl font-bold">
            No Orders Yet
          </h2>

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
                    {order.supplierName}
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



                  <p className="text-gray-500 mt-2">
                    {order.createdAt}
                  </p>


                </div>


                <span className="font-bold">
                  {order.status}
                </span>


              </div>



              <Link

                to={`/chat/${order.id}`}

                className="inline-block mt-6 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"

              >

                💬 Chat Supplier

              </Link>



              {order.status === "Accepted" &&
                order.paymentStatus !== "Paid" && (

                <button

                  onClick={() =>
                    paySupplier(order.id)
                  }

                  className="block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"

                >

                  💳 Pay {order.totalAmount || order.amount} USDC

                </button>

              )}



              {order.status === "Delivered" && (

                <button

                  onClick={() =>
                    confirmDelivery(order.id)
                  }

                  className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg"

                >

                  ✅ Confirm Delivery

                </button>

              )}



              {order.status === "Paid" && (

                <p className="mt-5 text-green-600 font-semibold">

                  ✅ Payment completed. Waiting for supplier delivery.

                </p>

              )}



              {order.status === "Completed" && (

                <p className="mt-5 text-green-700 font-bold">

                  🎉 Order Completed

                </p>

              )}

            </div>

          ))}

        </div>

      )}

    </div>

  );

}