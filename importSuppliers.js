import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

import Supplier from "./src/models/Supplier.js";

dotenv.config();

const suppliers = JSON.parse(
  fs.readFileSync(
    "./src/database/suppliers.json",
    "utf-8"
  )
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {

    console.log("MongoDB connected");

    await Supplier.deleteMany({});

    await Supplier.insertMany(suppliers);

    console.log("Suppliers imported successfully");

    process.exit();

  })
  .catch((error) => {

    console.error(error);

    process.exit(1);

  });