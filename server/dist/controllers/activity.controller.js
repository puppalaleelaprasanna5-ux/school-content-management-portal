import { getActivitiesService, getRecentActivitiesService, } from "../services/activity.service.js";
// Get All Activities
export const getActivities = async (req, res) => {
    try {
        const user = req.user;
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;
        const result = await getActivitiesService(user.schoolId, limit, offset);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get Recent Activities
export const getRecentActivities = async (req, res) => {
    try {
        const user = req.user;
        const limit = parseInt(req.query.limit) || 5;
        const result = await getRecentActivitiesService(user.schoolId, limit);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
