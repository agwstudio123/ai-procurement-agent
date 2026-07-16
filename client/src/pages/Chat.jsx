import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Chat() {

  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");



  useEffect(() => {

    loadChat();

    const interval = setInterval(() => {
      loadChat();
    }, 3000);


    return () => clearInterval(interval);

  }, [orderId]);





  async function loadChat() {

    try {

      const orderResponse = await fetch(
        "http://localhost:3000/orders"
      );


      const orders = await orderResponse.json();


      const currentOrder = orders.find(
        (item) =>
          String(item.id) === String(orderId)
      );


      setOrder(currentOrder);



      const chatResponse = await fetch(
        `http://localhost:3000/chats/${orderId}`
      );


      const chatData = await chatResponse.json();


      setMessages(chatData);



    } catch(error) {

      console.log(
        "CHAT LOAD ERROR:",
        error
      );

    }

  }





  async function saveMessage(newMessage) {

    try {


      await fetch(
        `http://localhost:3000/chats/${orderId}`,
        {

          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },


          body:JSON.stringify(newMessage)

        }
      );


      loadChat();



    } catch(error) {

      console.log(
        "MESSAGE ERROR:",
        error
      );

    }

  }





  async function sendMessage() {

    if(!message.trim()) return;



    const userType =
      localStorage.getItem("userType");



    const supplier =
      JSON.parse(
        localStorage.getItem("currentSupplier")
      );



    const contractor =
      JSON.parse(
        localStorage.getItem("currentContractor")
      );



    let name = "User";



    if(userType === "supplier") {

      name =
      supplier?.companyName || "Supplier";

    }



    if(userType === "contractor") {

      name =
      contractor?.companyName || "Contractor";

    }




    await saveMessage({

  sender: userType,
  senderRole: userType,

  name,

  text: message,

  type: "text",

  time: new Date().toLocaleTimeString()

});


    setMessage("");

  }







  async function sendDeliveryFee() {

    if(!deliveryFee) return;



    const supplier =
      JSON.parse(
        localStorage.getItem("currentSupplier")
      );



    await saveMessage({

  sender: "supplier",

  senderRole: "supplier",

  name: supplier?.companyName || "Supplier",

  text: `Delivery fee proposal: ${deliveryFee} USDC`,

  amount: Number(deliveryFee),

  type: "delivery_fee",

  time: new Date().toLocaleTimeString()

});



    setDeliveryFee("");

  }





  if(!order){

    return (

      <div className="p-10">

        Order not found.

      </div>

    );

  }







  return (

    <div className="min-h-screen bg-gray-100 p-10">


      <div className="bg-white rounded-xl shadow p-6">



        <h1 className="text-3xl font-bold">

          💬 Order Chat

        </h1>





        <div className="mt-5 bg-gray-100 p-5 rounded-lg">


          <p>

            <strong>
              Supplier:
            </strong>{" "}

            {order.supplierName}

          </p>



          <p>

            <strong>
              Status:
            </strong>{" "}

            {order.status}

          </p>



          <p>

            <strong>
              Total Amount:
            </strong>{" "}

            {order.totalAmount || order.amount} USDC

          </p>


        </div>







        <div className="mt-6 space-y-4">


          {
          messages.length === 0 ?


          <p className="text-gray-500">

            No messages yet.

          </p>


          :


          messages.map((msg,index)=>(


            <div

              key={index}

              className="bg-gray-100 rounded-lg p-4"

            >



              <p className="font-bold">

                {msg.name || msg.sender}

              </p>



              <p>

                {msg.text}

              </p>




              {
              msg.type==="delivery_fee" && (

                <p className="text-green-600 font-bold mt-2">

                  🚚 Delivery Cost Added:
                  {" "}
                  {msg.amount} USDC

                </p>

              )
              }




              <p className="text-xs text-gray-500">

                {msg.time}

              </p>



            </div>


          ))

          }



        </div>







        <div className="flex gap-3 mt-6">


          <input

            value={message}

            onChange={(e)=>setMessage(e.target.value)}

            placeholder="Discuss delivery, location, materials..."

            className="flex-1 border rounded-lg px-4 py-3"

          />



          <button

            onClick={sendMessage}

            className="bg-blue-600 text-white px-6 rounded-lg"

          >

            Send

          </button>



        </div>









        {
        localStorage.getItem("userType")==="supplier" &&


        <div className="mt-8 bg-green-50 p-5 rounded-xl">


          <h3 className="font-bold mb-3">

            🚚 Add Delivery Cost

          </h3>




          <input

            type="number"

            value={deliveryFee}

            onChange={(e)=>setDeliveryFee(e.target.value)}

            placeholder="Delivery fee in USDC"

            className="border rounded-lg p-3 w-full"

          />




          <button

            onClick={sendDeliveryFee}

            className="mt-3 bg-green-600 text-white px-6 py-3 rounded-lg"

          >

            Send Delivery Fee

          </button>



        </div>


        }



      </div>


    </div>

  );

}