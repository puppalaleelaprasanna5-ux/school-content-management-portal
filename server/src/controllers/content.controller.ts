import { Request, Response } from "express";

import {
  createContentService,
  getContentsService,
  getContentByIdService,
  updateContentService,
  deleteContentService,
} from "../services/content.service.js";

export const createContent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getContents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await getContentsService((req as any).user);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getContentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await getContentByIdService(
      String(req.params.id),
      (req as any).user
    );

    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateContent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = req.file;

    const result = await updateContentService(
      String(req.params.id),
      {
        title: req.body.title,
        description: req.body.description,
        textContent: req.body.textContent,
        filePath: file ? file.path : undefined,
      }
    );

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteContent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await deleteContentService(
      String(req.params.id)
    );

    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};