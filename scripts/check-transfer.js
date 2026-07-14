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
    await client.params.client.Transactions.getTransaction({
      id: "14d1596f-fa32-50ba-bb18-31f8308987cf",
    });

  console.log(JSON.stringify(response.data, null, 2));
} catch (error) {
  console.log("Status:", error.status);
  console.log("Code:", error.code);
  console.log("Message:", error.message);

  // Show the API response body if it exists
  if (error.response?.data) {
    console.log(JSON.stringify(error.response.data, null, 2));
  }
}