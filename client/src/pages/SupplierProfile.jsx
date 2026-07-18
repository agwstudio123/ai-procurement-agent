import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";

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
    trustScore: existing?.trustScore || 95,
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

  async function saveProfile(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/suppliers/${supplier.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(supplier),
        }
      );

      const result = await response.json();

      if (!result.success) {
        alert("Failed to update supplier profile.");
        return;
      }

      localStorage.setItem(
        "currentSupplier",
        JSON.stringify(result.supplier)
      );

      alert("Profile Updated Successfully!");

      navigate("/supplier-dashboard");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6 md:p-8">
        <h1 className="text-3xl font-bold">
          ⚙️ Edit Supplier Profile
        </h1>

        <p className="text-gray-600 mt-2">
          Update your company information.
        </p>

        <form
          onSubmit={saveProfile}
          className="mt-6 space-y-5"
        >
          <input
            name="companyName"
            value={supplier.companyName}
            onChange={handleChange}
            placeholder="Company Name"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            name="ownerName"
            value={supplier.ownerName}
            onChange={handleChange}
            placeholder="Owner Name"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            name="email"
            value={supplier.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            name="location"
            value={supplier.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            name="categories"
            value={supplier.categories}
            onChange={handleChange}
            placeholder="Categories"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="wallet"
            value={supplier.wallet}
            onChange={handleChange}
            placeholder="Wallet Address"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}