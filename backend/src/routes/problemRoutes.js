import express from "express";
import { getProblemById, getProblems } from "../controllers/problemController.js";

const router = express.Router();

// Public endpoints to fetch coding problems
router.get("/", getProblems);
router.get("/:id", getProblemById);

export default router;
