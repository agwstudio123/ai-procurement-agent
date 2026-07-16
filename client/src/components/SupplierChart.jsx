import { useEffect, useState } from "react";

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

    fetch("http://localhost:3000/suppliers")
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


        console.log("CHART DATA:", chartData);

        setSuppliers(chartData);

      })
      .catch((error) => {
        console.log(error);
      });


  }, []);



  return (

    <div className="bg-white rounded-2xl shadow p-6">


      <h2 className="text-xl font-bold text-slate-800 mb-6">
        Supplier Cost Comparison
      </h2>


      {suppliers.length > 0 ? (

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

      ) : (

        <p className="text-gray-500">
          No supplier data available
        </p>

      )}


    </div>

  );

}