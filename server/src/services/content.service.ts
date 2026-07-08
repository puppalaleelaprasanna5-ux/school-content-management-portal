import prisma from "../config/prisma.js";
import { ContentType } from "@prisma/client";

interface CreateContentData {
  title: string;
  description?: string;
  type: ContentType;
  folderId: string;
  uploadedById: string;
  filePath?: string;
  textContent?: string;
}

// Create PDF / Video / Text Content
export const createContentService = async (
  data: CreateContentData
) => {
  const {
    title,
    description,
    type,
    folderId,
    uploadedById,
    filePath,
    textContent,
  } = data;

  if (!title || !folderId || !uploadedById || !type) {
    throw new Error("Missing required fields.");
  }

  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });

  if (!folder) {
    throw new Error("Folder not found.");
  }

  const content = await prisma.content.create({
    data: {
      title,
      description,
      type,
      folderId,
      uploadedById,
      filePath,
      textContent,
      published: true,
      publishedAt: new Date(),
    },
  });

  return {
    success: true,
    message: "Content uploaded successfully.",
    data: content,
  };
};

// Get All Content
export const getContentsService = async () => {
  const contents = await prisma.content.findMany({
    include: {
      folder: true,
      uploadedBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    success: true,
    count: contents.length,
    data: contents,
  };
};

// Get Content By ID
export const getContentByIdService = async (
  id: string
) => {
  const content = await prisma.content.findUnique({
    where: {
      id,
    },
    include: {
      folder: true,
      uploadedBy: true,
    },
  });

  if (!content) {
    throw new Error("Content not found.");
  }

  return {
    success: true,
    data: content,
  };
};

// Update Text Content
export const updateContentService = async (
  id: string,
  title: string,
  description: string,
  textContent: string
) => {
  const existing = await prisma.content.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new Error("Content not found.");
  }

  const updated = await prisma.content.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      textContent,
    },
  });

  return {
    success: true,
    message: "Content updated successfully.",
    data: updated,
  };
};

// Delete Content
export const deleteContentService = async (
  id: string
) => {
  const existing = await prisma.content.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new Error("Content not found.");
  }

  await prisma.content.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
    message: "Content deleted successfully.",
  };
};