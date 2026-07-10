import { Router } from "express";
import { getActivities, getRecentActivities, } from "../controllers/activity.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = Router();
// Get All Activities
router.get("/", authenticate, getActivities);
// Get Recent Activities
router.get("/recent", authenticate, getRecentActivities);
export default router;
