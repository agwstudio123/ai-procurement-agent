import "dotenv/config";
import crypto from "crypto";
import {
  initiateDeveloperControlledWalletsClient,
} from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

const entitySecretCiphertext =
  await client.generateEntitySecretCiphertext();

const transfer =
  await client.params.client.Transactions.createDeveloperTransactionTransfer({
    walletId: process.env.WALLET_A_ID,
    tokenId: process.env.USDC_TOKEN_ID,
    destinationAddress: "0x6863eec5b8023d59de69695017342e723bd6e87a",
    amounts: ["1.000000"],
    entitySecretCiphertext,
    idempotencyKey: crypto.randomUUID(),
    feeLevel: "MEDIUM",
  });

console.log("TRANSFER:");
console.log(transfer.data);

const id = transfer.data.data.id;

console.log("ID:", id);

try {
  const tx =
    await client.params.client.Transactions.getTransaction({
      id,
    });

  console.log(tx.data);

} catch (e) {

  console.log("ERROR");
  console.log(e.response?.data || e);

}