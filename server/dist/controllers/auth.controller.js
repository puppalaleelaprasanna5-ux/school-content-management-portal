import { activateSchoolService, loginService, } from "../services/auth.service.js";
export const activateSchool = async (req, res) => {
    try {
        const result = await activateSchoolService(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
export const login = async (req, res) => {
    try {
        const result = await loginService(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};
export const me = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
