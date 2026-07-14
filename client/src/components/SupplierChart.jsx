import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


export default function SupplierChart() {

  const [suppliers, setSuppliers] = useState([]);


  useEffect(() => {

    fetch("http://localhost:3000/suppliers")
      .then((response) => response.json())
      .then((data) => {

        const chartData = data.map((supplier) => ({
          name: supplier.supplier,
          price: supplier.cement,
        }));

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



      <ResponsiveContainer width="100%" height={250}>


        <BarChart data={suppliers}>


          <XAxis dataKey="name" />


          <YAxis />


          <Tooltip />


          <Bar 
            dataKey="price"
            radius={[8,8,0,0]}
          />


        </BarChart>


      </ResponsiveContainer>


    </div>

  );
}