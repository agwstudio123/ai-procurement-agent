import { useEffect, useState } from "react";
import { API_URL } from "../api";

export default function SupplierTable() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {

    async function loadSuppliers() {

      try {

        const response = await fetch(
          `${API_URL}/suppliers`
        );

        const data = await response.json();

        setSuppliers(data);

      } catch (error) {

        console.error("Failed to load suppliers:", error);

      }

    }


    loadSuppliers();


    const interval = setInterval(() => {
      loadSuppliers();
    }, 5000);


    return () => clearInterval(interval);

  }, []);


  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">

      <h2 className="text-xl font-bold text-slate-800 mb-6">
        Supplier Comparison
      </h2>


      <table className="w-full">

        <thead>

          <tr className="text-left border-b">

            <th className="p-3">Supplier</th>

            <th className="p-3">Materials / Prices</th>

            <th className="p-3">Status</th>

            <th className="p-3">Wallet</th>

          </tr>

        </thead>


        <tbody>

          {suppliers.length === 0 ? (

            <tr>

              <td
                colSpan="4"
                className="p-6 text-center text-gray-500"
              >
                No suppliers have registered yet.
              </td>

            </tr>

          ) : (

            suppliers.map((supplier) => {

              const wallet =
                supplier.wallet || "Not Connected";


              return (

                <tr
                  key={supplier.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="p-3 font-semibold">
                    {supplier.companyName}
                  </td>


                  <td className="p-3">

                    {supplier.materials &&
                    supplier.materials.length > 0 ? (

                      supplier.materials.map((material) => (

                        <div
                          key={material.id}
                          className="mb-1"
                        >
                          {material.name} — {material.price} USDC
                        </div>

                      ))

                    ) : (

                      <span className="text-gray-500">
                        No materials yet
                      </span>

                    )}

                  </td>


                  <td className="p-3">

                    {supplier.trusted ? (

                      <span className="text-green-600 font-semibold">
                        Trusted ✅
                      </span>

                    ) : (

                      <span className="text-red-500">
                        Not Verified
                      </span>

                    )}

                  </td>


                  <td className="p-3 text-xs">

                    {wallet.length > 12
                      ? `${wallet.slice(0, 10)}...`
                      : wallet}

                  </td>


                </tr>

              );

            })

          )}

        </tbody>

      </table>

    </div>
  );
}