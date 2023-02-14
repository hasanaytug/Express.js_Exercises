import { Request, Response } from "express";
import joi from "joi";
import pgPromise from "pg-promise";

const db = pgPromise()("postgres://postgres:pgsql@localhost:5432/postgres");

const setupDb = async () => {
  await db.none(
    `DROP TABLE IF EXISTS planets;
    
    CREATE TABLE planets (
      id SERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT
    );`
  );
  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Jupiter')`);
};
setupDb();

const createScheme = joi.object({
  name: joi.string().required(),
});
const updateScheme = joi.object({
  name: joi.string().required(),
});

const getAllPlanets = async (req: Request, res: Response) => {
  const planets = await db.many(`SELECT * FROM planets;`);
  res.send(planets);
};

const getPlanetById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const planet = await db.one(`SELECT * FROM planets WHERE id=$1;`, Number(id));
  res.send(planet);
};

const create = async (req: Request, res: Response) => {
  const { name } = req.body;
  const newPlanet = { name };
  const validatedPlanet = createScheme.validate(newPlanet);

  if (validatedPlanet.error) {
    res.status(400).json({ msg: validatedPlanet.error });
    return;
  }
  await db.none(`INSERT INTO planets (name) VALUES ($1)`, name);
  res.status(200).json({ msg: "New planet created successfully" });
};

const updateById = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { id } = req.params;
  const validatedUpdate = updateScheme.validate({ name });

  if (validatedUpdate.error) {
    res.status(400).json({ msg: validatedUpdate.error });
    return;
  }
  await db.none(`UPDATE planets SET name = $1 WHERE id = $2`, [name, id]);

  res.status(200).json({ msg: "New planet was updated successfully" });
};

const createImage = async (req: Request, res: Response) => {
  console.log(req.file);
  const id = req.params.id;
  const filePath = req.file?.path;
  if (filePath) {
    db.none(`UPDATE planets SET image = $2 WHERE id = $1`, [id, filePath]);
    res.status(201).json({ msg: "New image created successfully" });
  } else {
    res.status(400).json({ msg: "Image couldn't created" });
  }
};

const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  await db.none(`DELETE FROM planets WHERE id = ${id}`);

  res.status(200).json({ msg: "New planet was deleted successfully" });
};

export {
  create,
  getAllPlanets,
  getPlanetById,
  updateById,
  deleteById,
  createImage,
};
