import { useEffect, useState } from "react";
import { API_URL } from "../api";

export default function TrustedSuppliers() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    loadTrustedSuppliers();
  }, []);

  async function loadTrustedSuppliers() {
    try {
      const response = await fetch(
        `${API_URL}/trusted-suppliers`
      );

      const data = await response.json();

      setSuppliers(data);

    } catch (error) {
      console.error(
        "Failed to load trusted suppliers:",
        error
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold">
        🏆 Trusted Suppliers
      </h1>

      <p className="text-gray-600 mt-2">
        Suppliers with successful completed orders.
      </p>

      {suppliers.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-8 mt-8 text-center">

          <h2 className="text-xl font-bold">
            No Trusted Suppliers Yet
          </h2>

        </div>

      ) : (

        <div className="grid gap-6 mt-8">

          {suppliers.map((supplier) => (

            <div
              key={supplier.id}
              className="bg-white rounded-xl shadow p-6"
            >

              <h2 className="text-2xl font-bold">
                {supplier.companyName}
              </h2>

              <p className="mt-2">
                📍 Location:{" "}
                {supplier.location}
              </p>

              <p className="mt-2">
                📦 Completed Orders:{" "}
                <strong>
                  {supplier.completedOrders}
                </strong>
              </p>

              <p className="mt-2">
                ⭐ Trust Score:{" "}
                <strong>
                  {supplier.trustScore}%
                </strong>
              </p>

              <div className="mt-4">

                <h3 className="font-bold">
                  Materials:
                </h3>

                <div className="flex flex-wrap gap-2 mt-2">

                  {supplier.materials.map((item) => (

                    <span
                      key={item.id}
                      className="bg-gray-200 rounded px-3 py-1"
                    >
                      {item.name}
                    </span>

                  ))}

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}