import { Request, Response } from "express";

export const activateSchool = async (
  req: Request,
  res: Response
) => {
  res.status(200).json({
    success: true,
    message: "School Activation API Working",
    data: req.body,
  });
};

export const login = async (
  req: Request,
  res: Response
) => {
  res.status(200).json({
    success: true,
    message: "Login API Working",
  });
};

export const me = async (
  req: Request,
  res: Response
) => {
  res.status(200).json({
    success: true,
    message: "Protected Route Working",
  });
};