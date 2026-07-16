import { useState } from "react";
import { API_URL } from "../api";

export default function BOQForm({ onResult }) {

  const [cement, setCement] = useState("");
  const [steel, setSteel] = useState("");
  const [blocks, setBlocks] = useState("");
  const [budget, setBudget] = useState("");

  const [result, setResult] = useState(null);


  async function handleSubmit(e) {

    e.preventDefault();

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

              steel: Number(steel),

              blocks: Number(blocks),

            },

            budget: Number(budget),

          }),
        }
      );


      const data = await response.json();


      console.log("BACKEND RESPONSE:", data);


      setResult(data);


      if(onResult){
        onResult(data);
      }


    } catch(error){

      console.log(error);

      alert("Backend connection failed");

    }

  }



  async function placeOrder(){

    if(!result || !result.supplier){
      return;
    }


    const contractor =
      JSON.parse(
        localStorage.getItem("currentContractor")
      );


    const order = {

      supplierId: result.supplier.id,

      supplierName: result.supplier.name,

      contractorId:
        contractor?.id || 1,


      materials: {

        cement: Number(cement),

        steel: Number(steel),

        blocks: Number(blocks),

      },


      amount:
        result.supplier.totalCost,


      totalAmount:
        result.supplier.totalCost,


      marketPrice:
        result.marketPrice,


      savings:
        result.savings,


      walletAddress:
        result.supplier.walletAddress,

    };


    try{


      const response = await fetch(
        `${API_URL}/orders`,
        {

          method:"POST",

          headers:{
            "Content-Type":"application/json",
          },

          body:JSON.stringify(order),

        }
      );


      const data = await response.json();


      console.log(
        "ORDER RESPONSE:",
        data
      );


      if(data.success){

        alert(
          "Order placed successfully"
        );

      }else{

        alert(
          data.message
        );

      }


    }
    catch(error){

      console.log(error);

      alert(
        "Order failed"
      );

    }

  }




  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold mb-6">
        Bill of Quantities
      </h2>



      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >


        <div>

          <label className="block mb-2 font-medium">
            Cement (Bags)
          </label>

          <input
            type="number"
            value={cement}
            onChange={(e)=>setCement(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

        </div>



        <div>

          <label className="block mb-2 font-medium">
            Steel (Lengths)
          </label>


          <input
            type="number"
            value={steel}
            onChange={(e)=>setSteel(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

        </div>



        <div>

          <label className="block mb-2 font-medium">
            Blocks
          </label>


          <input
            type="number"
            value={blocks}
            onChange={(e)=>setBlocks(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

        </div>



        <div>

          <label className="block mb-2 font-medium">
            Budget (USDC)
          </label>


          <input
            type="number"
            value={budget}
            onChange={(e)=>setBudget(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

        </div>



        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
        >
          🤖 Get AI Recommendation
        </button>


      </form>




      {
        result?.success && (

          <div className="mt-8 bg-gray-50 rounded-xl p-6">


            <h2 className="text-xl font-bold">
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

              className="mt-5 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"

            >

              ✅ Place Order

            </button>


          </div>

        )
      }


    </div>

  );

}