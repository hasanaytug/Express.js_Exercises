import { Request, Response } from "express";
import joi from "joi";

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

const getAllPlanets = (req: Request, res: Response) => {
  res.send(planets);
};

const getPlanetById = (req: Request, res: Response) => {
  const { id } = req.params;

  const planet = planets.find((p) => p.id === Number(id));
  res.send(planet);
};

const create = (req: Request, res: Response) => {
  const { id, name } = req.body;
  const newPlanet = { id, name };
  const validatedPlanet = createScheme.validate(newPlanet);

  if (validatedPlanet.error) {
    res.status(400).json({ msg: validatedPlanet.error });
    return;
  }
  planets = [...planets, newPlanet];
  res.status(200).json({ msg: "New planet created successfully" });
};

const updateById = (req: Request, res: Response) => {
  const { name } = req.body;
  const { id } = req.params;
  const validatedUpdate = updateScheme.validate({ name });

  if (validatedUpdate.error) {
    res.status(400).json({ msg: validatedUpdate.error });
    return;
  }
  planets = planets.map((p) => (p.id === Number(id) ? { ...p, name } : p));

  res.status(200).json({ msg: "New planet was updated successfully" });
};

const deleteById = (req: Request, res: Response) => {
  const { id } = req.params;

  planets = planets.filter((p) => p.id !== Number(id));

  res.status(200).json({ msg: "New planet was deleted successfully" });
};

export { create, getAllPlanets, getPlanetById, updateById, deleteById };
