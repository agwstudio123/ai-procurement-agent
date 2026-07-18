import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

import Contractor from "./src/models/Contractor.js";

dotenv.config();

const contractors = JSON.parse(
  fs.readFileSync(
    "./src/database/contractors.json",
    "utf-8"
  )
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {

    console.log("MongoDB connected");

    await Contractor.deleteMany({});

    await Contractor.insertMany(contractors);

    console.log("Contractors imported successfully");

    process.exit();

  })
  .catch((error) => {

    console.error(error);

    process.exit(1);

  });