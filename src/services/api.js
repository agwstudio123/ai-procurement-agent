import axios from "axios";
import { API_URL } from "./api";

export async function runProcurement() {
  const response = await axios.post(
    `${API_URL}/procurement`,
    {
      cement: 200,
      steel: 36,
      blocks: 494,
      budget: 6000,
    }
  );

  return response.data;
}