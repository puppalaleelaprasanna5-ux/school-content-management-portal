import prisma from "../config/prisma.js";
import { ContentType } from "@prisma/client";

/** Minimal shape of the authenticated user needed for access scoping. */
interface RequestUser {
  role: string;
  gradeId?: string | null;
  classId?: string | null;
}

/**
 * Prisma `where` fragment restricting content to what a student may see:
 * published items in a folder targeted at their class, or a grade-wide folder
 * (no class) for their grade. Returns `null` for staff (no filter).
 */
const studentContentWhere = (user?: RequestUser) => {
  if (!user || user.role !== "STUDENT") return null;
  const folderClauses: any[] = [];
  if (user.classId) folderClauses.push({ classId: user.classId });
  if (user.gradeId) folderClauses.push({ gradeId: user.gradeId, classId: null });
  return {
    published: true,
    folder: { is: { OR: folderClauses.length ? folderClauses : [{ id: "__none__" }] } },
  };
};

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
export const getContentsService = async (user?: RequestUser) => {
  const scope = studentContentWhere(user);

  const contents = await prisma.content.findMany({
    ...(scope ? { where: scope } : {}),
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

// Get Content By ID (students may only view published items within their scope)
export const getContentByIdService = async (
  id: string,
  user?: RequestUser
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

  if (user && user.role === "STUDENT") {
    const f = content.folder;
    const inScope =
      (!!user.classId && f?.classId === user.classId) ||
      (!!user.gradeId && f?.gradeId === user.gradeId && f?.classId === null);
    if (!content.published || !inScope) {
      throw new Error("Content not found.");
    }
  }

  return {
    success: true,
    data: content,
  };
};

// Update Text Content
export const updateContentService = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    textContent?: string;
    filePath?: string;
  }
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
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.textContent && { textContent: data.textContent }),
      ...(data.filePath && { filePath: data.filePath }),
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