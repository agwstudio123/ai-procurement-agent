import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SupplierMaterials() {
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();

  async function loadMaterials() {
    try {
      const currentSupplier = JSON.parse(
        localStorage.getItem("currentSupplier")
      );

      if (!currentSupplier) return;

      const response = await fetch(
        "http://localhost:3000/suppliers"
      );

      const suppliers = await response.json();

      const supplier = suppliers.find(
        (item) => item.id === currentSupplier.id
      );

      if (supplier) {
        setMaterials(supplier.materials || []);

        localStorage.setItem(
          "currentSupplier",
          JSON.stringify(supplier)
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadMaterials();

    window.addEventListener("focus", loadMaterials);

    return () => {
      window.removeEventListener("focus", loadMaterials);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            🧱 My Materials
          </h1>

          <p className="text-gray-600 mt-2">
            Manage materials available for contractors.
          </p>
        </div>

        <button
          onClick={() => navigate("/supplier-add-material")}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          + Add Material
        </button>

      </div>

      <div className="grid grid-cols-3 gap-6 mt-8">

        {materials.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="font-bold text-xl">
              No Material Added
            </h2>

            <p className="mt-2 text-gray-500">
              Start adding materials for contractors.
            </p>

          </div>
        ) : (
          materials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-6"
            >
              <h2 className="text-xl font-bold">
                {item.name}
              </h2>

              <p className="mt-3">
                Quantity:
                <span className="font-semibold">
                  {" "}{item.quantity} {item.unit}
                </span>
              </p>

              <p>
                Price:
                <span className="font-semibold">
                  {" "}{item.price} USDC / {item.unit}
                </span>
              </p>

              <p>
                Location:
                <span className="font-semibold">
                  {" "}{item.location}
                </span>
              </p>

              <div className="mt-4 bg-green-100 text-green-700 p-2 rounded-lg text-center">
                ✅ {item.status}
              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
}