import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SupplierAddMaterial() {
  const navigate = useNavigate();

  const [material, setMaterial] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    price: "",
    location: "",
    wallet: "",
  });

  function handleChange(e) {
    setMaterial({
      ...material,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const currentSupplier = JSON.parse(
      localStorage.getItem("currentSupplier")
    );

    if (!currentSupplier) {
      alert("Please log in as a supplier.");
      return;
    }

    const updatedSupplier = {
      ...currentSupplier,
      materials: [...(currentSupplier.materials || [])],
    };

    // Check if material already exists
    const existingIndex = updatedSupplier.materials.findIndex(
      (item) =>
        item.category.toLowerCase() ===
        material.category.toLowerCase()
    );

    if (existingIndex !== -1) {
      // Update existing material
      updatedSupplier.materials[existingIndex] = {
        ...updatedSupplier.materials[existingIndex],
        ...material,
        status: "Available",
      };
    } else {
      // Add new material
      updatedSupplier.materials.push({
        id: Date.now(),
        ...material,
        supplierId: currentSupplier.id,
        supplierName: currentSupplier.companyName,
        status: "Available",
      });
    }

    const category = material.category.toLowerCase();

    if (category === "cement") {
      updatedSupplier.cementPrice = Number(material.price);
    }

    if (category === "steel") {
      updatedSupplier.steelPrice = Number(material.price);
    }

    if (category === "block" || category === "blocks") {
      updatedSupplier.blockPrice = Number(material.price);
    }

    try {
      const response = await fetch(
        `http://localhost:3000/suppliers/${updatedSupplier.id}`,
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
        alert("Failed to save material.");
        return;
      }

      localStorage.setItem(
        "currentSupplier",
        JSON.stringify(updatedSupplier)
      );

      alert("Material saved successfully!");

      navigate("/supplier-materials");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold">
          Add New Material
        </h1>

        <p className="text-gray-600 mt-2">
          Add materials contractors can purchase.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <input
            name="name"
            placeholder="Material Name"
            value={material.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="category"
            placeholder="Category (Cement, Steel, Blocks)"
            value={material.category}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="quantity"
            placeholder="Quantity Available"
            value={material.quantity}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="unit"
            placeholder="Unit"
            value={material.unit}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="price"
            placeholder="Price (USDC)"
            value={material.price}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={material.location}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="wallet"
            placeholder="Wallet Address (Optional)"
            value={material.wallet}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
          >
            Save Material
          </button>
        </form>
      </div>
    </div>
  );
}