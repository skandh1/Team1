import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAppliedProjects } from "../controllers/appliedProject.controller.js";

const router = express.Router();

router.get("/see", protectRoute, getAppliedProjects)



export default router;
