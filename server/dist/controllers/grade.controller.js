import { createGradeService, getGradesService, getGradeByIdService, updateGradeService, deleteGradeService, } from "../services/grade.service.js";
// Create Grade
export const createGrade = async (req, res) => {
    try {
        const result = await createGradeService(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
// Get All Grades
export const getGrades = async (_req, res) => {
    try {
        const result = await getGradesService();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get Grade By ID
export const getGradeById = async (req, res) => {
    try {
        const result = await getGradeByIdService(String(req.params.id));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
// Update Grade
export const updateGrade = async (req, res) => {
    try {
        const result = await updateGradeService(String(req.params.id), req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
// Delete Grade
export const deleteGrade = async (req, res) => {
    try {
        const result = await deleteGradeService(String(req.params.id));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
