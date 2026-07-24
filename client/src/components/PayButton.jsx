import { useState } from "react";
import { API_URL } from "../api";

export default function PayButton({ order }) {

  const [message, setMessage] = useState("");



  async function handlePayment() {


    try {


      if(!order){

        setMessage(
          "Order not found."
        );

        return;

      }



      const response = await fetch(

        `${API_URL}/orders/${order.id}`,

        {

          method:"PUT",

          headers:{
            "Content-Type":"application/json",
          },


          body:JSON.stringify({

            paymentStatus:"Paid"

          })

        }

      );



      const data =
        await response.json();



      console.log(
        "PAYMENT RESPONSE:",
        data
      );



      if(data.success){

        setMessage(
          "✅ Payment successful."
        );

      }else{

        setMessage(
          data.message
        );

      }



    }catch(error){


      console.log(
        "Payment error:",
        error
      );


      setMessage(
        "❌ Payment failed."
      );

    }

  }





  return (

    <div>


      <button

        onClick={handlePayment}

        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl mt-4"

      >

        💳 Pay USDC

      </button>



      {message && (

        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">

          <p className="font-semibold text-green-700">

            {message}

          </p>

        </div>

      )}


    </div>

  );

}