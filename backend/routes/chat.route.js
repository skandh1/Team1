import express from 'express';

import { protectRoute } from '../middleware/auth.middleware.js';
import { getChatToken, getUser, channel } from '../controllers/chat.controller.js';
import searchUser from '../controllers/serach.controller.js';

const router = express.Router();

router.get("/token", protectRoute, getChatToken)
router.get("/search", protectRoute, searchUser)
router.post("/channel", protectRoute, channel)
router.get("/users", protectRoute, getUser)


export default router;