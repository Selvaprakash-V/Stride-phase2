import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createProblem, getProblemById, getProblems, markProblemSolved, getMySolvedProblems } from "../controllers/problemController.js";

const router = express.Router();

// Public endpoints to fetch coding problems
router.get("/", getProblems);
router.get("/:id", getProblemById);

// Host-only endpoint to create a new problem
router.post("/", protectRoute, createProblem);

// Solved problems endpoints
router.post("/solved", protectRoute, markProblemSolved);
router.get("/my-solved", protectRoute, getMySolvedProblems);

export default router;
