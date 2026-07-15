import { Request, Response } from "express";

import {
  createFolderService,
  getFoldersService,
  getFolderByIdService,
  updateFolderService,
  deleteFolderService,
  getFolderTreeService,
} from "../services/folder.service.js";

// Create Folder
export const createFolder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    const result = await createFolderService({
      ...req.body,
      schoolId: user.schoolId,
      createdById: user.id,
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Folders
export const getFolders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await getFoldersService((req as any).user);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Folder By ID
export const getFolderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await getFolderByIdService(
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

export const getFolderTree = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await getFolderTreeService();

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Folder
export const updateFolder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await updateFolderService(
      String(req.params.id),
      req.body
    );

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Folder
export const deleteFolder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await deleteFolderService(String(req.params.id));

    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};