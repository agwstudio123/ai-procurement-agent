import "dotenv/config";
import axios from "axios";

const transactionId = "14d1596f-fa32-50ba-bb18-31f8308987cf";

try {
  const response = await axios.get(
    `https://api.circle.com/v1/w3s/transactions/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
      },
    }
  );

  console.log(JSON.stringify(response.data, null, 2));
} catch (error) {
  console.log("Status:", error.response?.status);
  console.log(JSON.stringify(error.response?.data, null, 2));
}