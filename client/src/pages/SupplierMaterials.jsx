import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

export default function SupplierMaterials() {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSupplier();
  }, []);

  async function loadSupplier() {
    try {
      const currentSupplier = JSON.parse(
        localStorage.getItem("currentSupplier")
      );

      console.log("Current Supplier:", currentSupplier);

      if (!currentSupplier) {
        console.log("No currentSupplier found in localStorage.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/suppliers`);
      const suppliers = await response.json();

      console.log("All Suppliers:", suppliers);
      console.log("Current Supplier ID:", currentSupplier.id);

      const latestSupplier = suppliers.find(
        (item) => Number(item.id) === Number(currentSupplier.id)
      );

      console.log("Matched Supplier:", latestSupplier);

      if (latestSupplier) {
        setSupplier(latestSupplier);

        localStorage.setItem(
          "currentSupplier",
          JSON.stringify(latestSupplier)
        );
      } else {
        console.log("Supplier NOT found in database.");
      }

      setLoading(false);
    } catch (error) {
      console.log("LOAD SUPPLIER ERROR:", error);
      setLoading(false);
    }
  }

  async function deleteMaterial(id) {
    const confirmDelete = window.confirm(
      "Delete this material?"
    );

    if (!confirmDelete) return;

    try {
      const updatedSupplier = {
        ...supplier,
        materials: supplier.materials.filter(
          (item) => item.id !== id
        ),
      };

      const response = await fetch(
        `${API_URL}/suppliers/${supplier.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSupplier),
        }
      );

      const result = await response.json();

      if (!result.success) {
        alert("Failed to delete material.");
        return;
      }

      localStorage.setItem(
        "currentSupplier",
        JSON.stringify(updatedSupplier)
      );

      setSupplier(updatedSupplier);

      alert("Material deleted successfully.");
    } catch (error) {
      console.log(error);
      alert("Unable to connect to server.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading materials...
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No supplier found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            📦 My Materials
          </h1>

          <p className="text-gray-600 mt-2">
            Manage all materials available to contractors.
          </p>
        </div>

        <Link
          to="/supplier-add-material"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-center"
        >
          + Add Material
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {supplier.materials && supplier.materials.length > 0 ? (
          supplier.materials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">
                    {item.name}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {item.category}
                  </p>
                </div>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {item.status || "Available"}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                <p>
                  <strong>Quantity:</strong>{" "}
                  {item.quantity} {item.unit}
                </p>

                <p>
                  <strong>Price:</strong>{" "}
                  {Number(item.price).toFixed(2)} USDC
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {item.location || supplier.location}
                </p>

                <p className="break-all">
                  <strong>Wallet:</strong>{" "}
                  {item.wallet || supplier.wallet || "Not provided"}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  to={`/supplier-add-material/${item.id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteMaterial(item.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-2xl font-bold">
              No Materials Added
            </h2>

            <p className="text-gray-500 mt-3">
              Start by adding your first construction material.
            </p>

            <Link
              to="/supplier-add-material"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
            >
              Add Material
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}