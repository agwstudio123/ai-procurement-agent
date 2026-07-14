import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const suppliers = [
  {
    id: 1,
    name: "BuildMax Materials",
    material: "Cement",
    price: 5000,
    trusted: true
  },
  {
    id: 2,
    name: "Prime Steel Ltd",
    material: "Steel Rod",
    price: 7500,
    trusted: true
  }
];

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/suppliers", (req, res) => {
  res.json(suppliers);
});

app.post("/procurement", (req, res) => {
  const { material } = req.body;

  res.json({
    message: "Procurement received",
    material,
    supplier: suppliers[0]
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});