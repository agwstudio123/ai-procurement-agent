import "dotenv/config";

console.log("API Key:", process.env.CIRCLE_API_KEY);
console.log("Entity Secret:", process.env.CIRCLE_ENTITY_SECRET);

import { registerEntitySecretCiphertext } from "@circle-fin/developer-controlled-wallets";

const response = await registerEntitySecretCiphertext({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
  recoveryFileDownloadPath: "./recovery",
});

console.log("Registration complete!");
console.log(response.data);