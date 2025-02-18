import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteProject,
  getAllCandidates,
  getMyProjects,
  selectApplicant,
  tollgeProject,
} from "../controllers/editProject.controller.js";

const router = express.Router();

router.patch("/:id", protectRoute, tollgeProject);
router.get("/", protectRoute, getMyProjects);
router.delete("/:id", protectRoute, deleteProject);
router.get("/applicants/:id", protectRoute, getAllCandidates);
router.post("/select-applicant", protectRoute, selectApplicant)
export default router;
