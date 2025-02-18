import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  applyToProject,
  createProject,
  getProjects,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", protectRoute, createProject);
router.get("/", protectRoute, getProjects);
router.post("/apply/:id", protectRoute, applyToProject);
// router.delete("/:id", protectRoute, deleteProject);

export default router;
