import { Request, Response } from "express";

import {
  activateSchoolService,
  loginService,
} from "../services/auth.service.js";

export const activateSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await activateSchoolService(req.body);

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await loginService(req.body);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const me = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      user: (req as any).user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};