import dotenv from "dotenv";
import passport from "passport";
import passportJwt from "passport-jwt";
import db from "./db.js";

dotenv.config();
const secret = process.env.SECRET;

passport.use(
  new passportJwt.Strategy(
    {
      secretOrKey: secret,
      jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      const user = await db.one(
        `SELECT * FROM users WHERE id = $1`,
        payload.id
      );

      try {
        return user
          ? done(null, user)
          : done(new Error("Could not find the user"));
      } catch (error) {
        done(error);
      }
    }
  )
);
