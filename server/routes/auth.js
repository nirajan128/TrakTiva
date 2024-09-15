import express from "express";
import db from "../config/db.js";
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("API is working!");
});

export default router;
