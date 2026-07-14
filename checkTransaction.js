import "dotenv/config";
import axios from "axios";

const transactionId = "81f809f7-d103-50de-98db-66cc09c1f397";

const response = await axios.get(
  `https://api.circle.com/v1/w3s/transactions/${transactionId}`,
  {
    headers: {
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`
    }
  }
);

console.log(JSON.stringify(response.data, null, 2));