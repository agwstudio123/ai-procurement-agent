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

  const lowestPrice =
    suppliers.length > 0
      ? Math.min(...suppliers.map((s) => s.price))
      : 0;

  const averagePrice =
    suppliers.length > 0
      ? (
          suppliers.reduce(
            (sum, s) => sum + s.price,
            0
          ) / suppliers.length
        ).toFixed(3)
      : 0;

  return (
    <div className="bg-white rounded-2xl shadow p-6">

      <h2 className="text-xl font-bold text-slate-800 mb-6">
        Supplier Cost Comparison
      </h2>

      <ResponsiveContainer width="100%" height={320}>
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

      {/* MARKET ANALYTICS */}
      <div className="grid lg:grid-cols-3 gap-6 mt-8">

        {/* LEFT */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">

          <div className="bg-slate-100 rounded-xl p-5 text-center shadow-sm">
            <p className="text-gray-500 text-sm">
              Suppliers
            </p>

            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              {suppliers.length}
            </h3>
          </div>

          <div className="bg-green-100 rounded-xl p-5 text-center shadow-sm">
            <p className="text-gray-500 text-sm">
              Lowest Cement Price
            </p>

            <h3 className="text-3xl font-bold text-green-700 mt-2">
              {lowestPrice} USDC
            </h3>
          </div>

          <div className="bg-blue-100 rounded-xl p-5 text-center shadow-sm">
            <p className="text-gray-500 text-sm">
              Average Price
            </p>

            <h3 className="text-3xl font-bold text-blue-700 mt-2">
              {averagePrice} USDC
            </h3>
          </div>

          <div className="bg-yellow-100 rounded-xl p-5 text-center shadow-sm">
            <p className="text-gray-500 text-sm">
              Competition
            </p>

            <h3 className="text-3xl font-bold text-yellow-700 mt-2">
              {suppliers.length > 3 ? "High" : "Medium"}
            </h3>
          </div>

        </div>

        {/* RIGHT */}
        <div className="rounded-xl p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">

          <h3 className="text-2xl font-bold mb-5">
            📈 Market Insights
          </h3>

          <div className="space-y-4">

            <div>
              <p className="text-blue-200 text-sm">
                Active Suppliers
              </p>

              <p className="text-2xl font-bold">
                {suppliers.length}
              </p>
            </div>

            <div>
              <p className="text-blue-200 text-sm">
                Lowest Market Price
              </p>

              <p className="text-xl font-bold">
                {lowestPrice} USDC
              </p>
            </div>

            <div>
              <p className="text-blue-200 text-sm">
                Average Price
              </p>

              <p className="text-xl font-bold">
                {averagePrice} USDC
              </p>
            </div>

            <div>
              <p className="text-blue-200 text-sm">
                AI Recommendation
              </p>

              <p className="leading-7">
                Compare quotations from multiple
                verified suppliers before placing
                procurement orders. Current market
                competition is
                <strong>
                  {" "}
                  {suppliers.length > 3
                    ? "High"
                    : "Medium"}
                </strong>
                , giving contractors better pricing opportunities.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}