import dotenv from "dotenv";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

dotenv.config();

const sdk = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.ENTITY_SECRET,
});

const response =
  await sdk.params.configurationsClient.DeveloperAccount.getPublicKey();

console.log(response);