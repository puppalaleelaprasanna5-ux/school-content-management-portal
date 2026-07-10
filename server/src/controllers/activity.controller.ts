import { Request, Response } from "express";

import {
  getActivitiesService,
  getRecentActivitiesService,
} from "../services/activity.service.js";

// Get All Activities
export const getActivities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await getActivitiesService(user.schoolId, limit, offset);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Recent Activities
export const getRecentActivities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await getRecentActivitiesService(user.schoolId, limit);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
