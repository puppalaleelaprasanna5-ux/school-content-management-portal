import { createFolderService, getFoldersService, getFolderByIdService, updateFolderService, deleteFolderService, getFolderTreeService, } from "../services/folder.service.js";
// Create Folder
export const createFolder = async (req, res) => {
    try {
        const user = req.user;
        const result = await createFolderService({
            ...req.body,
            schoolId: user.schoolId,
            createdById: user.id,
        });
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
// Get All Folders
export const getFolders = async (_req, res) => {
    try {
        const result = await getFoldersService();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get Folder By ID
export const getFolderById = async (req, res) => {
    try {
        const result = await getFolderByIdService(String(req.params.id));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
export const getFolderTree = async (_req, res) => {
    try {
        const result = await getFolderTreeService();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Update Folder
export const updateFolder = async (req, res) => {
    try {
        const result = await updateFolderService(String(req.params.id), req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
// Delete Folder
export const deleteFolder = async (req, res) => {
    try {
        const result = await deleteFolderService(String(req.params.id));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
