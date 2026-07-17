import { useEffect, useState } from "react";
import { API_URL } from "../api";

export default function SupplierEarnings() {

  const supplier = JSON.parse(
    localStorage.getItem("currentSupplier")
  );

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    async function loadOrders() {

      try {

        const response = await fetch(
          `${API_URL}/orders`
        );

        const data = await response.json();

        const supplierOrders = data.filter(
          (order) =>
            Number(order.supplierId) === Number(supplier?.id) &&
            order.paymentStatus === "Paid"
        );

        setOrders(supplierOrders);

      } catch (error) {

        console.log(error);

      }

    }

    loadOrders();

  }, []);

  const totalEarned = orders.reduce(
    (sum, order) =>
      sum + Number(order.totalAmount || 0),
    0
  );

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold">
        💰 Earnings
      </h1>

      <p className="text-gray-500 mt-2">
        Overview of payments received from completed orders.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-500">
            Total Earnings
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {totalEarned.toFixed(5)} USDC
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-500">
            Paid Orders
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {orders.length}
          </h2>

        </div>

      </div>

      <div className="bg-white rounded-xl shadow mt-8 overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Contractor
              </th>

              <th className="p-4 text-left">
                Amount
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  className="p-6 text-center text-gray-500"
                >
                  No payments received yet.
                </td>

              </tr>

            ) : (

              orders.map((order) => (

                <tr
                  key={order.id}
                  className="border-t"
                >

                  <td className="p-4 font-semibold">
                    {order.contractorName || "Contractor"}
                  </td>

                  <td className="p-4">
                    {Number(order.totalAmount || 0).toFixed(5)} USDC
                  </td>

                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Paid
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}