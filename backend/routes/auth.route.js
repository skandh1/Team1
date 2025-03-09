import express from "express";
import { login, logout, signup, getCurrentUser, verifyEmail, verifySecurityAnswer, resetPassword, test } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verifyEmail", verifyEmail);
router.post("/verifySecurityAnswer", verifySecurityAnswer);
router.post("/resetPassword", resetPassword);
router.post("/verifyEmail", verifyEmail);
router.get("/test", test)

router.get("/me", protectRoute, getCurrentUser);

export default router;
