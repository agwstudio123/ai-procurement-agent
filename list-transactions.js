import "dotenv/config";
import {
  initiateDeveloperControlledWalletsClient,
} from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

try {
  const response =
    await client.params.client.Transactions.listTransactions({
      walletIds: [process.env.WALLET_A_ID],
    });

  console.log(JSON.stringify(response.data, null, 2));

} catch (error) {

  console.log("ERROR:");
  console.log(error.response?.data || error.message);

}