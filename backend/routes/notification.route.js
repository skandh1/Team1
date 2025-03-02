import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	deleteAllNotifications,
	deleteNotification,
	getUserNotifications,
	markAllNotificationsAsRead,
	markNotificationAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUserNotifications);

router.put("/:id/read", protectRoute, markNotificationAsRead);
router.delete("/:id", protectRoute, deleteNotification);
router.delete('/', protectRoute, deleteAllNotifications);
router.put('/mark-all-read', protectRoute, markAllNotificationsAsRead);

export default router;
