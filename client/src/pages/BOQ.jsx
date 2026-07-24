import { useState } from "react";
import { API_URL } from "../api";

export default function BOQ() {

  const [cement, setCement] = useState("");
  const [blocks, setBlocks] = useState("");
  const [steel, setSteel] = useState("");

  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");


  async function findSupplier() {

    try {

      const response = await fetch(
        `${API_URL}/procurement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            quantities: {
              cement: Number(cement),
              blocks: Number(blocks),
              steel: Number(steel),
            },
          }),
        }
      );


      const data = await response.json();

      console.log("AI RESPONSE:", data);

      setResult(data);


    } catch (error) {

      console.log(
        "Procurement error:",
        error
      );

    }

  }



  async function placeOrder() {

    try {

      const contractor =
        JSON.parse(
          localStorage.getItem("currentContractor")
        );


      if (!contractor) {

        setMessage(
          "❌ Contractor session not found. Login again."
        );

        return;

      }



      const response = await fetch(
        `${API_URL}/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },


          body: JSON.stringify({

            contractorId:
              contractor.id,


            contractorName:
              contractor.companyName,


            supplierId:
              result.supplier.id,


            supplierName:
              result.supplier.name,


            amount:
              result.supplier.totalCost,


            totalAmount:
              result.supplier.totalCost,


            marketPrice:
              result.marketPrice,


            savings:
              result.savings,


            materials: {

              cement: Number(cement),

              blocks: Number(blocks),

              steel: Number(steel),

            },


            status:
              "Pending",


            paymentStatus:
              "Unpaid"

          })

        }
      );



      const data =
        await response.json();


      console.log(
        "ORDER RESPONSE:",
        data
      );



      if (data.success) {

        setMessage(
          "✅ Order placed successfully!"
        );

      } else {

        setMessage(
          data.message
        );

      }



    } catch(error) {

      console.log(
        "Order error:",
        error
      );


      setMessage(
        "❌ Failed to place order"
      );

    }

  }




  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold">
        📋 Bill of Quantities
      </h1>


      <p className="text-gray-600 mt-2">
        Enter your construction materials.
      </p>



      <div className="bg-white rounded-xl shadow p-6 mt-8 max-w-xl">


        <label className="font-semibold">
          Cement Quantity
        </label>

        <input
          type="number"
          value={cement}
          onChange={(e)=>setCement(e.target.value)}
          placeholder="Example: 10"
          className="w-full border p-4 rounded mt-2 mb-5"
        />



        <label className="font-semibold">
          Blocks Quantity
        </label>

        <input
          type="number"
          value={blocks}
          onChange={(e)=>setBlocks(e.target.value)}
          placeholder="Example: 100"
          className="w-full border p-4 rounded mt-2 mb-5"
        />



        <label className="font-semibold">
          Steel Quantity
        </label>

        <input
          type="number"
          value={steel}
          onChange={(e)=>setSteel(e.target.value)}
          placeholder="Example: 20"
          className="w-full border p-4 rounded mt-2 mb-5"
        />



        <button
          onClick={findSupplier}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          🤖 Find Best Supplier
        </button>


      </div>





      {result && (

        result.success ? (

          <div className="bg-white rounded-xl shadow p-6 mt-8 max-w-xl">


            <h2 className="text-2xl font-bold">
              🤖 AI Recommendation
            </h2>



            <p className="mt-3">
              Supplier:
              <strong>
                {" "}
                {result.supplier.name}
              </strong>
            </p>



            <p className="mt-2">
              Total Cost:
              <strong>
                {" "}
                {result.supplier.totalCost} USDC
              </strong>
            </p>



            <button

              onClick={placeOrder}

              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-bold"

            >
              ✅ Place Order

            </button>



            {message && (

              <p className="mt-4 font-semibold">
                {message}
              </p>

            )}



          </div>


        ) : (


          <div className="bg-red-100 text-red-700 p-5 mt-8 rounded-lg max-w-xl">

            {result.message || "Something went wrong"}

          </div>


        )

      )}



    </div>

  );

}