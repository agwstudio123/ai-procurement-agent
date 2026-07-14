import dotenv from "dotenv";
dotenv.config();

console.log(JSON.stringify(process.env.CIRCLE_PUBLIC_KEY));