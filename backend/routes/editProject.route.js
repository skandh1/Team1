import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteProject,
  getAllCandidates,
  getCreatedByProject,
  getMyProjects,
  getProjectRatings,
  getUserDetails,
  removeApplicant,
  selectApplicant,
  startProject,
  submitProjectRatings,
  tollgeProject,
  unApplyProject,
  updateProjectStatus,
} from "../controllers/editProject.controller.js";

const router = express.Router();

router.patch("/:id", protectRoute, tollgeProject);
router.get("/", protectRoute, getMyProjects);
router.delete("/:id", protectRoute, deleteProject);
router.get("/applicants/:id", protectRoute, getAllCandidates);
router.post("/select-applicant", protectRoute, selectApplicant)
router.post("/remove-applicant", protectRoute, removeApplicant)
router.patch("/status/:id", protectRoute, updateProjectStatus);
router.post('/:id/ratings', protectRoute, submitProjectRatings);
router.get('/:id/ratings', protectRoute, getProjectRatings);
router.post("/user/details", protectRoute, getUserDetails);
router.get("/project/createdBy/:id", protectRoute, getCreatedByProject)
router.post("/start/:id", protectRoute, startProject)
router.post("/unapply/:id", protectRoute, unApplyProject)
export default router;
