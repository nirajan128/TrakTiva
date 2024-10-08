import express from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";
import passport from "../config/passport.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("API is working!");
});

//for registering user
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    console.log(name, email, password);

    // Check if user exists
    const userExist = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into the database
    const newUser = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    //Login the user directly
    req.login(newUser.rows[0], (err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        message: "Registration successful, now logged in.",
        user: newUser.rows[0],
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
});

//for logging in
//uses passport .authenticate to authenicate the user and redirect based on the result
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message || "Login failed" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      /* return res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      }); */
      return res.redirect("/auth/user");
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.json({ message: "Logged out successfully" });
    console.log("logged out");
  });
});

router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    // For API routes, it's better to send a JSON response with an appropriate status code
    res.status(401).json({ message: "Unauthorized. Please log in." });
  }
}
router.get("/user", ensureAuthenticated, async (req, res) => {
  try {
    // Assuming req.user contains all the user data you want to send
    // If you need to fetch additional data, do it here
    const userData = {
      name: req.user.name,
      email: req.user.email,
      // Add any other user properties you want to include
    };

    res.json({ message: "User data retrieved successfully", user: userData });
  } catch (error) {
    console.error("Error in /userData route:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving user data" });
  }
});

export default router;
