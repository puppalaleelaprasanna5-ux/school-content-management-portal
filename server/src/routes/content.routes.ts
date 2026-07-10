import { Router } from "express";

import upload from "../config/multer.js";

import {
  createContent,
  getContents,
  getContentById,
  updateContent,
  deleteContent,
} from "../controllers/content.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "STAFF"),
  upload.single("file"),
  createContent
);

router.get("/", authenticate, getContents);

router.get("/:id", authenticate, getContentById);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "STAFF"),
  upload.single("file"),
  updateContent
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "STAFF"),
  deleteContent
);

export default router;