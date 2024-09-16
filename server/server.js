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

// Middleware
const allowedOrigins = [
  "https://traktiva.onrender.com/", // frontend Render URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        // Allow requests with no origin (e.g., Postman)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow headers
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

//Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //resave: forces a session to be stored in a session store (ex: database)
    saveUninitialized: false, //saveUninitialaized: forces a session that is unInitialized to be savd in session store, a session is UI when it is new but not modiefied
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Cookie expiry time
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "none", // For cross-site requests
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Parse JSON bodies

// Define routes

app.use("/auth", authRoutes); // example route for auth
app.use("/user", userData);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
