import express from "express";
import dotenv from "dotenv";
import cors from "cors";
/* import passport from "./config/passport.js"; */

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* // Passport middleware
app.use(passport.initialize());
app.use(passport.session()); */

// Define routes
import authRoutes from "./routes/auth.js";
app.use("/auth", authRoutes); // example route for auth

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
