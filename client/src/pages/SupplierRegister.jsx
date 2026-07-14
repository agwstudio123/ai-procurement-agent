import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SupplierRegister() {
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    location: "",
    materials: "",
    wallet: "",
    password: "",
  });

  function handleChange(e) {
    setSupplier({
      ...supplier,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Get existing suppliers from backend
      const response = await fetch(
        "http://localhost:3000/suppliers"
      );

      const suppliers = await response.json();

      const exists = suppliers.find(
        (item) =>
          item.companyName.toLowerCase() ===
            supplier.companyName.toLowerCase() ||
          item.email.toLowerCase() ===
            supplier.email.toLowerCase()
      );

      if (exists) {
        alert(
          "A supplier with this company name or email already exists."
        );
        return;
      }

      const newSupplier = {
        id: Date.now(),

        companyName: supplier.companyName,
        ownerName: supplier.ownerName,
        email: supplier.email,
        password: supplier.password,

        location: supplier.location,

        categories: supplier.materials,

        wallet: supplier.wallet.trim() || "Not Connected",

        trusted: true,
        trustScore: 95,

        materials: [],

        activeOrders: 0,
        completedOrders: 0,
        earnings: 0,

        createdAt: new Date().toLocaleString(),
      };

      // Save supplier to backend
      const saveResponse = await fetch(
        "http://localhost:3000/suppliers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSupplier),
        }
      );

      const result = await saveResponse.json();

      if (!result.success) {
        alert("Failed to register supplier.");
        return;
      }

      // Keep logged-in session
      localStorage.setItem(
        "currentSupplier",
        JSON.stringify(newSupplier)
      );

      localStorage.setItem(
        "userType",
        "supplier"
      );

      alert("Supplier account created successfully!");

      navigate("/supplier-dashboard");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8">

        <h1 className="text-3xl font-bold">
          🚚 Become a Supplier
        </h1>

        <p className="text-gray-600 mt-2">
          Register your company and start supplying contractors.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <input
            name="companyName"
            placeholder="Company Name"
            value={supplier.companyName}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="ownerName"
            placeholder="Owner Name"
            value={supplier.ownerName}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={supplier.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="location"
            placeholder="Business Location"
            value={supplier.location}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="materials"
            placeholder="Materials you supply (Cement, Blocks, Steel)"
            value={supplier.materials}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="wallet"
            placeholder="Wallet Address (Optional)"
            value={supplier.wallet}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={supplier.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold"
          >
            Create Supplier Account
          </button>
        </form>
      </div>
    </div>
  );
}