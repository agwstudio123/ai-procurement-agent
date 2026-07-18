import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("URI exists:", !!process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ CONNECTED TO MONGODB");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ CONNECTION FAILED");
    console.error(err);
    process.exit();
  });