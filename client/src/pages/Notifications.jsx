import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Notifications() {

  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();



  useEffect(() => {

    async function loadNotifications() {

      const supplier = JSON.parse(
        localStorage.getItem("currentSupplier")
      );

      const contractor = JSON.parse(
        localStorage.getItem("currentContractor")
      );


      const user = supplier || contractor;


      if (!user) return;



      try {


        const response = await fetch(
          `http://localhost:3000/notifications/${user.id}`
        );


        const data = await response.json();


        setNotifications(data);



        // mark notifications as read
        await fetch(
          `http://localhost:3000/notifications/${user.id}/read`,
          {
            method: "PUT",
          }
        );


        // update UI
        setNotifications(
          data.map((notification)=>({
            ...notification,
            read:true
          }))
        );


      } catch(error) {

        console.error(
          "Notification error:",
          error
        );

      }

    }


    loadNotifications();


  }, []);




 function openNotification(notification) {


  const supplier = JSON.parse(
    localStorage.getItem("currentSupplier")
  );


  const contractor = JSON.parse(
    localStorage.getItem("currentContractor")
  );



  // Chat notification
  if(notification.type === "chat") {

    navigate(
      `/chat/${notification.orderId}`
    );

    return;

  }



  // Delivery fee request
  if(notification.type === "delivery_fee") {

    navigate(
      `/chat/${notification.orderId}`
    );

    return;

  }



  // Any order update
  if(notification.type === "order") {


    // Supplier side
    if(supplier) {

      navigate(
        "/supplier-orders"
      );

      return;

    }



    // Contractor side
    if(contractor) {

      navigate(
        "/contractor-orders"
      );

      return;

    }


  }


}




  return (

    <div className="p-10">


      <h1 className="text-3xl font-bold">
        🔔 Notifications
      </h1>



      <p className="text-gray-500 mt-2">
        Recent updates about orders and chats.
      </p>




      <div className="mt-8 bg-white rounded-xl shadow">


        {
          notifications.length === 0 ? (


            <div className="p-6 text-gray-500">
              No notifications.
            </div>


          ) : (


            notifications.map((notification)=>(


              <div

                key={notification.id}

                onClick={() =>
                  openNotification(notification)
                }


                className={`border-b p-5 cursor-pointer hover:bg-gray-50 ${
                  !notification.read
                    ? "bg-blue-50"
                    : ""
                }`}

              >


                <p className="font-semibold">

                  {notification.message}

                </p>




                <p className="text-sm text-gray-500 mt-2">

                  {
                    new Date(
                      notification.createdAt
                    ).toLocaleString()
                  }

                </p>


              </div>


            ))


          )
        }


      </div>


    </div>

  );

}