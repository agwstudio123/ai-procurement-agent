import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

export default function SupplierOrders() {

  const [orders, setOrders] = useState([]);
  const [supplier, setSupplier] = useState(null);


  useEffect(() => {

    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 3000);


    return () => clearInterval(interval);

  }, []);



  async function loadOrders() {

    const currentSupplier = JSON.parse(
      localStorage.getItem("currentSupplier")
    );


    if (!currentSupplier) return;


    setSupplier(currentSupplier);


    try {

      const response = await fetch(
        `${API_URL}/orders`
      );


      const allOrders = await response.json();


      const supplierOrders = allOrders.filter(
        (order) =>
          Number(order.supplierId) === Number(currentSupplier.id) &&
          order.status !== "Completed" &&
          order.status !== "Rejected"
      );


      setOrders(supplierOrders);


    } catch(error){

      console.error(
        "Failed to load orders:",
        error
      );

    }

  }





  async function updateStatus(orderId,newStatus){

    try{

      const response = await fetch(
        `${API_URL}/orders/${orderId}`,
        {
          method:"PUT",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({
            status:newStatus,
          }),
        }
      );


      const data = await response.json();


      if(!data.success){

        alert("Failed to update order.");
        return;

      }


      loadOrders();


    }catch(error){

      console.error(error);

      alert(
        "Backend connection failed."
      );

    }

  }





  if(!supplier){

    return(

      <div className="p-5 md:p-10">

        Supplier not found.

      </div>

    );

  }





  return (

    <div className="
      min-h-screen
      bg-gray-100
      p-4
      md:p-10
    ">


      <h1 className="
        text-2xl
        md:text-3xl
        font-bold
      ">

        📦 Incoming Orders

      </h1>



      <p className="
        text-gray-600
        mt-2
      ">

        Orders waiting for your action.

      </p>





      {
        orders.length === 0 ? (


          <div className="
            bg-white
            rounded-xl
            shadow
            p-8
            mt-8
            text-center
          ">


            <h2 className="
              text-xl
              md:text-2xl
              font-bold
            ">

              No Orders Yet

            </h2>


            <p className="text-gray-500 mt-3">

              Contractor requests will appear here.

            </p>


          </div>


        ) : (


          <div className="
            grid
            gap-5
            mt-8
          ">



          {orders.map((order)=>(


            <div
              key={order.id}
              className="
                bg-white
                rounded-xl
                shadow
                p-5
                md:p-6
              "
            >




              <div className="
                flex
                flex-col
                md:flex-row
                md:justify-between
                gap-4
              ">



                <div className="break-words">


                  <h2 className="
                    text-xl
                    font-bold
                  ">

                    {order.contractorName}

                  </h2>




                  <p className="mt-3">

                    Amount:

                    <strong>
                      {" "}
                      {order.totalAmount || order.amount} USDC
                    </strong>

                  </p>




                  <p className="mt-2">

                    Payment:

                    <strong>
                      {" "}
                      {order.paymentStatus || "Unpaid"}
                    </strong>

                  </p>





                  {order.transactionId && (

                    <p className="
                      mt-3
                      text-sm
                      break-all
                    ">

                      Transaction ID:

                      <br/>

                      {order.transactionId}

                    </p>

                  )}






                  <p className="
                    mt-3
                    text-sm
                    break-all
                  ">


                    Wallet:

                    <br/>

                    {order.supplierWallet || "Not Connected"}


                  </p>






                  <p className="
                    mt-3
                    text-gray-500
                    text-sm
                  ">

                    {new Date(
                      order.createdAt
                    ).toLocaleString()}


                  </p>



                </div>







                <span

                  className={`
                    px-4
                    py-2
                    rounded-full
                    font-bold
                    h-fit
                    w-fit

                    ${
                      order.status==="Pending"
                      ?"bg-yellow-100 text-yellow-700"

                      :order.status==="Accepted"
                      ?"bg-blue-100 text-blue-700"

                      :order.status==="Payment Secured"
                      ?"bg-green-100 text-green-700"

                      :order.status==="Dispatched"
                      ?"bg-indigo-100 text-indigo-700"

                      :order.status==="Delivered"
                      ?"bg-purple-100 text-purple-700"

                      :"bg-red-100 text-red-700"
                    }
                  `}

                >

                  {order.status}

                </span>




              </div>






              <Link

                to={`/chat/${order.id}`}

                className="
                  mt-6
                  block
                  text-center
                  bg-purple-600
                  text-white
                  px-5
                  py-3
                  rounded-lg
                "

              >

                💬 Chat Contractor

              </Link>









              {order.status==="Pending" && (

                <div className="
                  flex
                  flex-col
                  sm:flex-row
                  gap-3
                  mt-4
                ">


                  <button

                    onClick={() =>
                      updateStatus(
                        order.id,
                        "Accepted"
                      )
                    }

                    className="
                      bg-green-600
                      text-white
                      px-5
                      py-3
                      rounded-lg
                      w-full
                    "

                  >

                    ✅ Accept Order

                  </button>





                  <button

                    onClick={() =>
                      updateStatus(
                        order.id,
                        "Rejected"
                      )
                    }

                    className="
                      bg-red-600
                      text-white
                      px-5
                      py-3
                      rounded-lg
                      w-full
                    "

                  >

                    ❌ Reject

                  </button>



                </div>


              )}








              {order.status==="Payment Secured" && (

                <div className="mt-5">


                  <p className="
                    text-green-600
                    font-bold
                    mb-3
                  ">

                    🔒 Payment Secured

                  </p>



                  <button

                    onClick={() =>
                      updateStatus(
                        order.id,
                        "Dispatched"
                      )
                    }

                    className="
                      bg-blue-600
                      text-white
                      px-5
                      py-3
                      rounded-lg
                      w-full
                    "

                  >

                    🚚 Dispatch Materials

                  </button>


                </div>

              )}







              {order.status==="Dispatched" && (

                <button

                  onClick={() =>
                    updateStatus(
                      order.id,
                      "Delivered"
                    )
                  }

                  className="
                    mt-5
                    bg-green-600
                    text-white
                    px-5
                    py-3
                    rounded-lg
                    w-full
                  "

                >

                  📦 Mark as Delivered

                </button>


              )}







              {order.status==="Delivered" && (

                <div className="
                  mt-5
                  p-4
                  bg-yellow-50
                  rounded-lg
                  border
                  border-yellow-300
                ">


                  <p className="
                    font-semibold
                    text-yellow-800
                  ">

                    ⏳ Waiting for contractor confirmation.

                  </p>



                  <p className="
                    text-sm
                    text-yellow-700
                    mt-2
                  ">

                    Payment is safely held in escrow and will be released after delivery confirmation.

                  </p>


                </div>

              )}



            </div>


          ))}



          </div>


        )


      }



    </div>

  );

}