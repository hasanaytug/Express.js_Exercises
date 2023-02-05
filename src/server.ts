import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import {
  create,
  getAllPlanets,
  getPlanetById,
  updateById,
  deleteById,
} from "./controllers/planets.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/planets", getAllPlanets);

app.get("/api/planets/:id", getPlanetById);

app.post("/api/planets", create);

app.put("/api/planets/:id", updateById);

app.delete("/api/planets/:id", deleteById);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
