import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import db from "./db.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          email,
        ]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            return done(null, user);
          }
        }
        return done(null, false, { message: "Incorrect email or password." });
      } catch (error) {
        return done(error);
      }
    }
  )
);

//To save a specific key of user data for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//fetch the data using the key stored
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [id]
    );
    done(null, result.rows[0]);
  } catch (error) {
    done(error);
  }
});

export default passport;
