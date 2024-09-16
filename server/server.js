import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "./config/passport.js";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import userData from "./routes/userData.js";

dotenv.config();
const app = express();
const PORT = 5000;

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "https://traktiva.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

app.use(passport.initialize());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      domain: ".onrender.com",
    },
    proxy: true,
  })
);

app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Is Authenticated:", req.isAuthenticated());
  next();
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/auth", authRoutes);
app.use("/", userData);

app.use((err, req, res, next) => {
  console.error("Error details:", err);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
