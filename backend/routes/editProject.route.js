import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteProject,
  getAllCandidates,
  getMyProjects,
  tollgeProject,
} from "../controllers/editProject.controller.js";

const router = express.Router();

router.patch("/:id", protectRoute, tollgeProject);
router.get("/", protectRoute, getMyProjects);
router.delete("/:id", protectRoute, deleteProject);
router.get("/", protectRoute, getAllCandidates);

export default router;
