import { createClassService, getClassesService, getClassByIdService, updateClassService, deleteClassService, } from "../services/class.service.js";
// Create Class
export const createClass = async (req, res) => {
    try {
        const result = await createClassService(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
// Get All Classes
export const getClasses = async (_req, res) => {
    try {
        const result = await getClassesService();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get Class By ID
export const getClassById = async (req, res) => {
    try {
        const result = await getClassByIdService(String(req.params.id));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
// Update Class
export const updateClass = async (req, res) => {
    try {
        const result = await updateClassService(String(req.params.id), req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
// Delete Class
export const deleteClass = async (req, res) => {
    try {
        const result = await deleteClassService(String(req.params.id));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
