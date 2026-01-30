import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createProblem, getProblemById, getProblems } from "../controllers/problemController.js";

const router = express.Router();

// Public endpoints to fetch coding problems
router.get("/", getProblems);
router.get("/:id", getProblemById);

// Host-only endpoint to create a new problem
router.post("/", protectRoute, createProblem);

export default router;
