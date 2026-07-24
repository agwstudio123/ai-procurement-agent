import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import toast from "react-hot-toast";

export default function SupplierRegister() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/suppliers`);
      const suppliers = await response.json();

      const exists = suppliers.find(
        (item) =>
          item.companyName?.toLowerCase() ===
            supplier.companyName.toLowerCase() ||
          item.email?.toLowerCase() ===
            supplier.email.toLowerCase()
      );

      if (exists) {
        toast.error(
          "A supplier with this company name or email already exists."
        );
        setLoading(false);
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

        trusted: false,
        trustScore: 0,

        materials: [],

        activeOrders: 0,
        completedOrders: 0,
        earnings: 0,

        createdAt: new Date().toLocaleString(),
      };

      const saveResponse = await fetch(`${API_URL}/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSupplier),
      });

      const result = await saveResponse.json();

      if (!result.success) {
        toast.error("Failed to register supplier.");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "currentSupplier",
        JSON.stringify(result.supplier)
      );

      localStorage.setItem("userType", "supplier");

      toast.success(
        "Supplier account created successfully!"
      );

      navigate("/supplier-dashboard");
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      toast.error("Unable to connect to the server.");
    } finally {
      setLoading(false);
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
          {[
            ["companyName", "Company Name"],
            ["ownerName", "Owner Name"],
            ["location", "Business Location"],
            ["materials", "Materials you supply (Cement, Blocks, Steel)"],
          ].map(([name, placeholder]) => (
            <input
              key={name}
              name={name}
              placeholder={placeholder}
              value={supplier[name]}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />
          ))}

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
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold"
          >
            {loading ? "Creating Account..." : "Create Supplier Account"}
          </button>
        </form>
      </div>
    </div>
  );
}