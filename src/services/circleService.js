import "dotenv/config";
import crypto from "crypto";
import {
  initiateDeveloperControlledWalletsClient,
} from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

// ===============================
// Send USDC
// ===============================
export async function sendUSDC(destinationAddress, amount) {
  try {
    const cleanAmount = Number(amount).toFixed(6);

    console.log("Sending USDC:", cleanAmount);
    console.log("Destination:", destinationAddress);
    console.log("Wallet ID:", process.env.WALLET_A_ID);
    console.log("Token ID:", process.env.USDC_TOKEN_ID);

    const entitySecretCiphertext =
      await client.generateEntitySecretCiphertext();

    const response =
      await client.params.client.Transactions.createDeveloperTransactionTransfer({
        walletId: process.env.WALLET_A_ID,
        tokenId: process.env.USDC_TOKEN_ID,
        destinationAddress,
        amounts: [cleanAmount],
        idempotencyKey: crypto.randomUUID(),
        entitySecretCiphertext,
        feeLevel: "MEDIUM",
      });

    console.log("========== PAYMENT SUCCESS ==========");
    console.log(response.data);

    return response.data.data;

  } catch (error) {

    console.error("========== PAYMENT ERROR ==========");

    if (error.response) {
      console.log(
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.log(error.message);
    }

    throw error;
  }
}

// ===============================
// Check Wallet Balance
// ===============================
export async function checkUSDCBalance() {
  try {

    const response = await client.getWalletTokenBalance({
      id: process.env.WALLET_A_ID,
    });

    return response.data;

  } catch (error) {

    console.error("========== BALANCE ERROR ==========");

    if (error.response) {
      console.log(
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.log(error.message);
    }

    throw error;
  }
}

// ===============================
// Check Transaction Status
// ===============================
export async function getTransactionStatus(transactionId) {

  try {

    const response =
      await client.params.client.Transactions.listTransactions();

    const transaction =
      response.data.data.transactions.find(
        (tx) => tx.id === transactionId
      );

    if (!transaction) {
      throw new Error("Transaction not found.");
    }

    console.log("Transaction Status:");
    console.log(transaction);

    return {
      transaction,
    };

  } catch (error) {

    console.error("========== STATUS ERROR ==========");

    if (error.response) {
      console.log(
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.log(error.message);
    }

    throw error;

  }

}