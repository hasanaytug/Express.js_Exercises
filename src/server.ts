import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import {
  create,
  getAllPlanets,
  getPlanetById,
  updateById,
  deleteById,
  createImage,
} from "./controllers/planets.js";
import { getUsers, signUp, login, logout } from "./controllers/users.js";
import multer from "multer";
import authorize from "./authorize.js";
import "./passport.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

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

app.post("/api/planets/:id/image", upload.single("image"), createImage);

app.get("/api/users", getUsers);
app.post("/api/users/signup", signUp);
app.post("/api/users/login", login);
app.get("/api/users/logout", authorize, logout);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
