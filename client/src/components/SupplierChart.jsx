import { useEffect, useState } from "react";
import { API_URL } from "../api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SupplierChart() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/suppliers`)
      .then((response) => response.json())
      .then((data) => {
        const chartData = data.map((supplier) => {
          const cement =
            supplier.materials?.find(
              (item) =>
                item.name.toLowerCase() === "cement"
            )?.price || 0;

          return {
            name: supplier.companyName,
            price: Number(cement),
          };
        });

        setSuppliers(chartData);
      })
      .catch(console.log);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-6">

      <h2 className="text-xl font-bold text-slate-800 mb-6">
        Supplier Cost Comparison
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={suppliers}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="name"
            angle={-25}
            textAnchor="end"
            interval={0}
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="price"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* DASHBOARD SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

        <div className="bg-slate-100 rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Suppliers</p>
          <h3 className="text-3xl font-bold">
            {suppliers.length}
          </h3>
        </div>

        <div className="bg-green-100 rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Lowest Cement Price</p>
          <h3 className="text-2xl font-bold">
            {suppliers.length
              ? Math.min(...suppliers.map((s) => s.price))
              : 0}{" "}
            USDC
          </h3>
        </div>

        <div className="bg-blue-100 rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Average Price</p>
          <h3 className="text-2xl font-bold">
            {suppliers.length
              ? (
                  suppliers.reduce(
                    (sum, s) => sum + s.price,
                    0
                  ) / suppliers.length
                ).toFixed(3)
              : 0}{" "}
            USDC
          </h3>
        </div>

        <div className="bg-yellow-100 rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Competition</p>
          <h3 className="text-2xl font-bold">
            {suppliers.length > 3 ? "High" : "Medium"}
          </h3>
        </div>

      </div>

    </div>
  );
}