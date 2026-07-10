import { Request, Response } from "express";

import {
  createStudentService,
  getStudentsService,
  getStudentByIdService,
  updateStudentService,
  deleteStudentService,
} from "../services/student.service.js";

// Create Student
export const createStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    const result = await createStudentService({
      ...req.body,
      schoolId: user.schoolId,
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Students
export const getStudents = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await getStudentsService();

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Student By ID
export const getStudentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await getStudentByIdService(String(req.params.id));

    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Student
export const updateStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await updateStudentService(
      String(req.params.id),
      req.body
    );

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Student
export const deleteStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await deleteStudentService(String(req.params.id));

    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
