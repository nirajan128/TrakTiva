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

//Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //resave: forces a session to be stored in a session store (ex: database)
    saveUninitialized: true, //saveUninitialaized: forces a session that is unInitialized to be savd in session store, a session is UI when it is new but not modiefied
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //period of cookier in milisecond totals to 1 day
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware
// Define allowed origins
const allowedOrigins = [
  "https://storied-pothos-6e0ce6.netlify.app",
  // Add other allowed origins if needed
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Parse JSON bodies

// Define routes

app.use("/auth", authRoutes); // example route for auth
app.use("/user", userData);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
