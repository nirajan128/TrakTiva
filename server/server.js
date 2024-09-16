import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import passport from "./config/passport.js";
import session from "express-session";
//routes
import authRoutes from "./routes/auth.js";
import userData from "./routes/userData.js";

dotenv.config();
const app = express();
const PORT = 5000;

// CORS configuration
app.use(
  cors({
    origin: "https://traktiva.onrender.com",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //resave: forces a session to be stored in a session store (ex: database)
    saveUninitialized: false, //saveUninitialaized: forces a session that is unInitialized to be savd in session store, a session is UI when it is new but not modiefied
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Cookie expiry time
      httpOnly: true,
      secure: true, // Secure in production
      sameSite: "none", // For cross-site requests
      domain: ".onrender.com",
    },
    proxy: true,
  })
);
app.use(bodyParser.json()); // Parse JSON bodies

app.set("trust proxy", 1); //should add if app is running on third party
// Additional CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Handle preflight requests
app.options("*", cors());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/auth", authRoutes); // example route for auth
app.use("/", userData);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
