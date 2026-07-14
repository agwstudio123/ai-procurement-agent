import "dotenv/config";
import {
  initiateDeveloperControlledWalletsClient,
} from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

const response =
  await client.params.client.Transactions.createTransferEstimateFee({
    walletId: process.env.WALLET_A_ID,
    tokenId: process.env.USDC_TOKEN_ID,
    destinationAddress: process.env.WALLET_B_ADDRESS,
    amounts: ["1"],
  });

console.log(JSON.stringify(response.data, null, 2));