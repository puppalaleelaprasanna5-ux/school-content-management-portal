import { Router } from "express";

import {
  createFolder,
  getFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
  getFolderTree,
} from "../controllers/folder.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// Create Folder (Admin & Staff)
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "STAFF"),
  createFolder
);

// Get All Folders
router.get("/", authenticate, getFolders);

router.get("/tree", authenticate, getFolderTree);

// Get Folder By ID
router.get("/:id", authenticate, getFolderById);

// Rename Folder
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "STAFF"),
  updateFolder
);

// Delete Folder
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "STAFF"),
  deleteFolder
);

export default router;