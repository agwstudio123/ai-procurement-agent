import axios from "axios";

const API = "http://localhost:3000";


export async function runProcurement() {

  const response = await axios.post(
    `${API}/procurement`,
    {
      cement: 200,
      steel: 36,
      blocks: 494,
      budget: 6000
    }
  );

  return response.data;

}