import "dotenv/config";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET
});


const balance = await client.getWalletTokenBalance({
  id: "d95445d4-53dc-5778-b1e1-0268ea0664fb"
});


console.log(JSON.stringify(balance.data, null, 2));