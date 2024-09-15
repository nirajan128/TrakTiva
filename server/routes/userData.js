import express from "express";

const router = express.Router();

//Gets userData only if user is authenticated i.e (email and password matches)
router.get("/userData", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("Accessing /user/secData route");
    res.json({ message: "Welcome to your dashboard", user: req.user });
  } else {
    // If the user is not authenticated, send a 401 status (Unauthorized)
    res
      .status(401)
      .json({ message: "You are not authenticated. Please log in." });
  }
});

export default router;
