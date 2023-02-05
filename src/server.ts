import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import joi from "joi";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets: Planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

const createScheme = joi.object({
  id: joi.number().integer().required(),
  name: joi.string().required(),
});
const updateScheme = joi.object({
  name: joi.string().required(),
});
app.get("/api/planets", (req, res) => {
  res.send(planets);
});

app.get("/api/planets/:id", (req, res) => {
  const { id } = req.params;

  const planet = planets.find((p) => p.id === Number(id));
  res.send(planet);
});

app.post("/api/planets", (req, res) => {
  const { id, name } = req.body;
  const newPlanet = { id, name };
  const validatedPlanet = createScheme.validate(newPlanet);

  if (validatedPlanet.error) {
    res.status(400).json({ msg: validatedPlanet.error });
    return;
  }
  planets = [...planets, newPlanet];
  res.status(200).json({ msg: "New planet created successfully" });
});

app.put("/api/planets/:id", (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const validatedUpdate = updateScheme.validate({ name });

  if (validatedUpdate.error) {
    res.status(400).json({ msg: validatedUpdate.error });
    return;
  }
  planets = planets.map((p) => (p.id === Number(id) ? { ...p, name } : p));

  res.status(200).json({ msg: "New planet was updated successfully" });
});

app.delete("/api/planets/:id", (req, res) => {
  const { id } = req.params;

  planets = planets.filter((p) => p.id !== Number(id));

  res.status(200).json({ msg: "New planet was deleted successfully" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
