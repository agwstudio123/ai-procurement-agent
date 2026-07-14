import "dotenv/config";
import {
  initiateDeveloperControlledWalletsClient,
  Blockchain,
} from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

const response = await client.createWallets({
  accountType: "SCA",
 blockchains: [Blockchain.EthSepolia],
  count: 2,
  walletSetId: "cd344f7c-afe9-56fc-bcab-cd3ebcfb8b32",
});

console.log(JSON.stringify(response.data, null, 2));