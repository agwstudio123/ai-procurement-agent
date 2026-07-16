import { useState } from "react";

export default function AIAssistant() {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);


  async function sendMessage(customMessage = null) {

    const finalMessage = customMessage || message;


    if (!finalMessage.trim()) return;


    const userMessage = {
      role: "user",
      text: finalMessage,
    };


    setChat((prev) => [
      ...prev,
      userMessage,
    ]);


    try {

      const supplier = JSON.parse(
        localStorage.getItem("currentSupplier")
      );


      const contractor = JSON.parse(
        localStorage.getItem("currentContractor")
      );


      const userType = supplier
        ? "supplier"
        : "contractor";


      const response = await fetch(
        "http://localhost:3000/ai-assistant",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            message: finalMessage,

            userType,

            user:
              supplier ||
              contractor,

          }),

        }
      );


      const data = await response.json();


      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            data.reply ||
            "I could not find an answer.",
        },
      ]);


    } catch(error) {


      setChat((prev)=>[
        ...prev,
        {
          role:"ai",
          text:"AI service is unavailable.",
        },
      ]);

    }


    setMessage("");

  }



  const templates = [

    "Who is the cheapest cement supplier?",

    "How many suppliers do we have?",

    "Show trusted suppliers",

    "Tell me current material prices",

    "How much did I save?",

    "Show my orders",

  ];



  return (

    <>


      {/* Floating Button */}

      <button

        onClick={() =>
          setOpen(!open)
        }

        className="
        fixed
        bottom-6
        right-6
        bg-blue-600
        text-white
        w-16
        h-16
        rounded-full
        shadow-xl
        text-2xl
        z-50
        "

      >

        🤖

      </button>



      {
        open && (

          <div

            className="
            fixed
            bottom-24
            right-6
            w-96
            bg-white
            rounded-xl
            shadow-2xl
            border
            z-50
            "

          >


            <div

              className="
              bg-blue-600
              text-white
              p-4
              rounded-t-xl
              font-bold
              "

            >

              🤖 BuildProcure AI Assistant

            </div>



            <div

              className="
              p-3
              flex
              flex-wrap
              gap-2
              border-b
              "

            >

              {
                templates.map(
                  (item,index)=>(

                    <button

                      key={index}

                      onClick={()=>
                        sendMessage(item)
                      }

                      className="
                      text-xs
                      bg-gray-100
                      hover:bg-blue-100
                      px-3
                      py-2
                      rounded-full
                      "

                    >

                      {item}

                    </button>

                  )
                )
              }


            </div>




            <div

              className="
              h-80
              overflow-y-auto
              p-4
              "

            >


              {
                chat.length === 0 && (

                  <p className="text-gray-500">

                    Ask me about suppliers,
                    prices, orders, payments
                    or savings.

                  </p>

                )
              }



              {
                chat.map(
                  (item,index)=>(

                    <div

                      key={index}

                      className={`

                      mb-3

                      ${
                        item.role==="user"
                        ? "text-right"
                        : "text-left"

                      }

                      `}

                    >


                      <span

                        className={`

                        inline-block

                        rounded-lg

                        p-3

                        whitespace-pre-line

                        ${
                          item.role==="user"
                          ?
                          "bg-blue-100"
                          :
                          "bg-gray-100"

                        }

                        `}

                      >

                        {item.text}

                      </span>


                    </div>

                  )

                )

              }


            </div>




            <div

              className="
              flex
              border-t
              p-3
              "

            >


              <input


                value={message}


                onChange={(e)=>
                  setMessage(e.target.value)
                }


                onKeyDown={(e)=>{

                  if(e.key==="Enter"){
                    sendMessage();
                  }

                }}


                placeholder="Ask AI..."


                className="
                flex-1
                border
                rounded-lg
                p-2
                "

              />




              <button


                onClick={()=>
                  sendMessage()
                }


                className="
                ml-2
                bg-blue-600
                text-white
                px-4
                rounded-lg
                "

              >

                Send

              </button>


            </div>


          </div>

        )

      }


    </>

  );

}