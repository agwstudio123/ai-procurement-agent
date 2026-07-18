import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

import Order from "./src/models/Order.js";

dotenv.config();


const orders = JSON.parse(
  fs.readFileSync(
    "./src/database/orders.json",
    "utf-8"
  )
);


mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {

    console.log("MongoDB connected");


    await Order.deleteMany({});


    await Order.insertMany(orders);


    console.log("Orders imported successfully");


    process.exit();

  })
  .catch((error) => {

    console.error(error);

    process.exit(1);

  });