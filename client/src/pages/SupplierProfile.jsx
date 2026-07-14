import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SupplierProfile() {

  const navigate = useNavigate();

  const existing = JSON.parse(
    localStorage.getItem("currentSupplier")
  );

  const [supplier, setSupplier] = useState({
    id: existing?.id,
    companyName: existing?.companyName || "",
    ownerName: existing?.ownerName || "",
    email: existing?.email || "",
    location: existing?.location || "",
    categories: existing?.categories || "",
    wallet: existing?.wallet || "",
    materials: existing?.materials || [],
    earnings: existing?.earnings || 0,
    activeOrders: existing?.activeOrders || 0,
    trust: existing?.trust || 95,
    trusted: existing?.trusted ?? true,
    cementPrice: existing?.cementPrice,
    steelPrice: existing?.steelPrice,
    blockPrice: existing?.blockPrice,
  });

  function handleChange(e) {
    setSupplier({
      ...supplier,
      [e.target.name]: e.target.value,
    });
  }

  function saveProfile(e) {
    e.preventDefault();

    // Update current supplier
    localStorage.setItem(
      "currentSupplier",
      JSON.stringify(supplier)
    );

    // Update suppliers marketplace
    const suppliers =
      JSON.parse(localStorage.getItem("suppliers")) || [];

    const updatedSuppliers = suppliers.map((item) =>
      item.id === supplier.id ? supplier : item
    );

    localStorage.setItem(
      "suppliers",
      JSON.stringify(updatedSuppliers)
    );

    alert("Profile Updated Successfully!");

    navigate("/supplier-dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8">

        <h1 className="text-3xl font-bold">
          ⚙️ Edit Supplier Profile
        </h1>

        <form
          onSubmit={saveProfile}
          className="mt-6 space-y-4"
        >

          <input
            name="companyName"
            value={supplier.companyName}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            placeholder="Company Name"
          />

          <input
            name="ownerName"
            value={supplier.ownerName}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            placeholder="Owner Name"
          />

          <input
            name="location"
            value={supplier.location}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            placeholder="Location"
          />

          <input
            name="categories"
            value={supplier.categories}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            placeholder="Materials"
          />

          <input
            name="wallet"
            value={supplier.wallet}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            placeholder="Wallet Address"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold"
          >
            Save Changes
          </button>

        </form>

      </div>

    </div>
  );
}