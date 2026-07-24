import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Buffer } from "buffer";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";

window.Buffer = Buffer;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />

    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: "#1e293b",
          color: "#fff",
          fontWeight: "500",
        },
        success: {
          style: {
            background: "#16a34a",
          },
        },
        error: {
          style: {
            background: "#dc2626",
          },
        },
      }}
    />
  </StrictMode>
);