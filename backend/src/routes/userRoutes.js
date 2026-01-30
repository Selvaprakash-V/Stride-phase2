import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getMe, updateMe } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.put("/me", protectRoute, updateMe);

export default router;
