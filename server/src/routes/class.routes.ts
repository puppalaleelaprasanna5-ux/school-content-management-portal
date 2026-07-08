import { Router } from "express";

import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} from "../controllers/class.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post("/", authenticate, authorize("ADMIN"), createClass);

router.get("/", authenticate, getClasses);

router.get("/:id", authenticate, getClassById);

router.put("/:id", authenticate, authorize("ADMIN"), updateClass);

router.delete("/:id", authenticate, authorize("ADMIN"), deleteClass);

export default router;