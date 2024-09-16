import express from "express";

const router = express.Router();

// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    // For API routes, it's better to send a JSON response with an appropriate status code
    res.status(401).json({ message: "Unauthorized. Please log in." });
  }
}

// Gets userData only if user is authenticated
router.get("/userData", ensureAuthenticated, async (req, res) => {
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
