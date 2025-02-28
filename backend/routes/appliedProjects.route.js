import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAppliedProjects, leaveProject } from "../controllers/appliedProject.controller.js";

const router = express.Router();

router.get("/see", protectRoute, getAppliedProjects);


router.post("/leave", protectRoute, leaveProject);



export default router;
