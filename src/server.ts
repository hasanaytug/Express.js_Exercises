import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

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

app.get("/", (req, res) => {
  console.log(req);
  res.send(planets);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
