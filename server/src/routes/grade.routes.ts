import { Router } from "express";

import {
  createGrade,
  getGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
} from "../controllers/grade.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// Admin Only
router.post("/", authenticate, authorize("ADMIN"), createGrade);

router.get("/", authenticate, getGrades);

router.get("/:id", authenticate, getGradeById);

router.put("/:id", authenticate, authorize("ADMIN"), updateGrade);

router.delete("/:id", authenticate, authorize("ADMIN"), deleteGrade);

export default router;