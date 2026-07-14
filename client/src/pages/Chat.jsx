import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Chat() {
  const { orderId } = useParams();

  console.log("URL ORDER ID:", orderId);

  const [order, setOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadChat();
  }, [orderId]);

  function loadChat() {
    const orders =
      JSON.parse(localStorage.getItem("orders")) || [];

    const currentOrder = orders.find(
      (item) => String(item.id) === String(orderId)
    );

    setOrder(currentOrder);

    const chats =
      JSON.parse(localStorage.getItem("chats")) || [];

    console.log("URL:", JSON.stringify(orderId));

    console.log(
      "CHAT IDS:",
      chats.map((chat) => JSON.stringify(chat.orderId))
    );

    const chat = chats.find(
      (item) =>
        JSON.stringify(item.orderId) ===
        JSON.stringify(orderId)
    );

    console.log("FOUND:", chat);

    if (chat) {
      setMessages([...chat.messages]);
    } else {
      setMessages([]);
    }
  }

  function sendMessage() {
    if (!message.trim()) return;

    const userType =
      localStorage.getItem("userType");

    const currentSupplier = JSON.parse(
      localStorage.getItem("currentSupplier")
    );

    const currentContractor = JSON.parse(
      localStorage.getItem("currentContractor")
    );

    let senderName = "User";

    if (userType === "supplier") {
      senderName =
        currentSupplier?.companyName ||
        "Supplier";
    }

    if (userType === "contractor") {
      senderName =
        currentContractor?.companyName ||
        "Contractor";
    }

    const newMessage = {
      sender: userType,
      name: senderName,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    const chats =
      JSON.parse(localStorage.getItem("chats")) || [];

    const chatIndex = chats.findIndex(
      (item) => String(item.orderId) === String(orderId)
    );

    if (chatIndex >= 0) {
      chats[chatIndex].messages.push(newMessage);
    } else {
      chats.push({
        orderId: String(orderId),
        messages: [newMessage],
      });
    }

    localStorage.setItem(
      "chats",
      JSON.stringify(chats)
    );

    loadChat();

    setMessage("");
  }

  if (!order) {
    return (
      <div className="p-10">
        Order not found.
      </div>
    );
  }

  console.log("MESSAGES STATE:", messages);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold">
          💬 Order Chat
        </h1>

        <div className="mt-5 bg-gray-100 p-5 rounded-lg">
          <p>
            <strong>Supplier:</strong> {order.supplierName}
          </p>

          <p>
            <strong>Contractor:</strong> {order.contractorName}
          </p>

          <p>
            <strong>Amount:</strong> {order.amount} USDC
          </p>

          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {messages.length === 0 ? (
            <p className="text-gray-500">
              No messages yet.
            </p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg p-4"
              >
                <p className="font-bold">
                  {msg.name || msg.sender}
                </p>

                <p>
                  {msg.text || msg.message}
                </p>

                <p className="text-xs text-gray-500">
                  {msg.time}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <input
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Discuss delivery fee..."
            className="flex-1 border rounded-lg px-4 py-3"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-6 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}