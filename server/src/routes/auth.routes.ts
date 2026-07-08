import { Router } from "express";
import { activateSchool, login, me } from "../controllers/auth.controller.js";

const router = Router();

router.post("/activate", activateSchool);
router.post("/login", login);
router.get("/me", me);

export default router;