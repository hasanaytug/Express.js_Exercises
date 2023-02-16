import { Request, Response } from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const getUsers = async (req: Request, res: Response) => {
  const users = await db.many(`SELECT * FROM users;`);
  res.send(users);
};

const signUp = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  const user = await db.oneOrNone(`SELECT * FROM users WHERE name = $1`, name);
  if (user) {
    res.status(409).json({ msg: "User exists" });
  } else {
    await db.none(`INSERT INTO users (name,password) VALUES ($1,$2)`, [
      name,
      password,
    ]);
    res.status(201).json({ msg: "User Created successfully" });
  }
};

const login = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  const user = await db.oneOrNone(`SELECT * FROM users WHERE name = $1`, name);

  if (user && user.password === password) {
    const payload = {
      id: user.id,
      name,
    };

    const secret = process.env.SECRET || " ";
    const token = jwt.sign(payload, secret);
    await db.none(`UPDATE users SET token = $1 WHERE id = $2`, [
      token,
      user.id,
    ]);
    res.status(200).json({ msg: "login successful" });
    return;
  }
  res.status(400).json({ msg: "Wrong credentials" });
};

const logout = async (req: Request, res: Response) => {
  const user: any = req.user;
  if (user) {
    console.log("user exists: ");
    await db.none(`UPDATE users SET token = $2 WHERE id = $1`, [user.id, null]);
    res.status(200).json({ msg: "logout successful" });
    return;
  }
  console.log("User not found");
};

export { getUsers, signUp, login, logout };
