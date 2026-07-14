import "dotenv/config";

console.log("API KEY:", process.env.CIRCLE_API_KEY ? "Loaded ✅" : "Missing ❌");
console.log("ENTITY SECRET:", process.env.CIRCLE_ENTITY_SECRET ? "Loaded ✅" : "Missing ❌");

console.log(
  "API KEY FORMAT:",
  process.env.CIRCLE_API_KEY?.split(":")[0]
);