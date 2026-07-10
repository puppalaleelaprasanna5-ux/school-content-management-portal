import { Router } from "express";
import { createStudent, getStudents, getStudentById, updateStudent, deleteStudent, } from "../controllers/student.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
const router = Router();
// Create Student (Admin & Staff)
router.post("/", authenticate, authorize("ADMIN", "STAFF"), createStudent);
// Get All Students
router.get("/", authenticate, getStudents);
// Get Student By ID
router.get("/:id", authenticate, getStudentById);
// Update Student (Admin & Staff)
router.put("/:id", authenticate, authorize("ADMIN", "STAFF"), updateStudent);
// Delete Student (Admin & Staff)
router.delete("/:id", authenticate, authorize("ADMIN", "STAFF"), deleteStudent);
export default router;
