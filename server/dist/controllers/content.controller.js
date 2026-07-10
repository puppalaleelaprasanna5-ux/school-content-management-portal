import { createContentService, getContentsService, getContentByIdService, updateContentService, deleteContentService, } from "../services/content.service.js";
export const createContent = async (req, res) => {
    try {
        const user = req.user;
        const file = req.file;
        const result = await createContentService({
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            folderId: req.body.folderId,
            uploadedById: user.id,
            textContent: req.body.textContent,
            filePath: file ? file.path : undefined,
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
export const getContents = async (_req, res) => {
    try {
        const result = await getContentsService();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getContentById = async (req, res) => {
    try {
        const result = await getContentByIdService(String(req.params.id));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
export const updateContent = async (req, res) => {
    try {
        const file = req.file;
        const result = await updateContentService(String(req.params.id), {
            title: req.body.title,
            description: req.body.description,
            textContent: req.body.textContent,
            filePath: file ? file.path : undefined,
        });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
export const deleteContent = async (req, res) => {
    try {
        const result = await deleteContentService(String(req.params.id));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
