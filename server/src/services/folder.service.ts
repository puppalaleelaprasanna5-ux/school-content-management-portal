import prisma from "../config/prisma.js";

interface FolderData {
  name: string;
  schoolId: string;
  createdById: string;
  gradeId?: string;
  classId?: string;
  parentId?: string;
}

/** Minimal shape of the authenticated user needed for access scoping. */
interface RequestUser {
  role: string;
  gradeId?: string | null;
  classId?: string | null;
}

/**
 * Prisma `where` fragment restricting folders to those a student may see:
 * a folder targeted at their specific class, or a grade-wide folder (no class)
 * for their grade. Returns `null` when the caller is not a student (no filter).
 */
const studentFolderWhere = (user?: RequestUser) => {
  if (!user || user.role !== "STUDENT") return null;
  const clauses: any[] = [];
  if (user.classId) clauses.push({ classId: user.classId });
  if (user.gradeId) clauses.push({ gradeId: user.gradeId, classId: null });
  // A student with no grade/class can see nothing.
  return { OR: clauses.length ? clauses : [{ id: "__none__" }] };
};

/** Whether a single folder is within a student's scope. */
const folderInStudentScope = (
  folder: { gradeId: string | null; classId: string | null },
  user: RequestUser
) =>
  (!!user.classId && folder.classId === user.classId) ||
  (!!user.gradeId && folder.gradeId === user.gradeId && folder.classId === null);

// Create Folder
export const createFolderService = async (data: FolderData) => {
  const {
    name,
    schoolId,
    createdById,
    gradeId,
    classId,
    parentId,
  } = data;

  const folder = await prisma.folder.create({
    data: {
      name,
      schoolId,
      createdById,
      gradeId,
      classId,
      parentId,
    },
  });

  return {
    success: true,
    message: "Folder created successfully.",
    data: folder,
  };
};

// Get All Folders (scoped to the student's grade/class; unrestricted for staff)
export const getFoldersService = async (user?: RequestUser) => {
  const scope = studentFolderWhere(user);

  const folders = await prisma.folder.findMany({
    ...(scope ? { where: scope } : {}),
    include: {
      school: true,
      grade: true,
      class: true,
      parent: true,
      children: true,
      contents: true,
      createdBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    success: true,
    count: folders.length,
    data: folders,
  };
};

// Get Folder By ID.
// Returns the folder itself, ONLY its direct child folders (by parentId) and
// ONLY the content belonging to this folder. For students the child/content
// sets are additionally scoped at the query level to their grade/class and to
// published items, so no folder from another parent or branch can leak in.
export const getFolderByIdService = async (id: string, user?: RequestUser) => {
  const isStudent = !!user && user.role === "STUDENT";
  const childScope = studentFolderWhere(user); // {OR:[...]} for students, else null

  const folder = await prisma.folder.findUnique({
    where: {
      id,
    },
    include: {
      school: true,
      grade: true,
      class: true,
      parent: true,
      createdBy: true,
      // Direct children only (Prisma `children` = rows whose parentId === id).
      children: {
        ...(childScope ? { where: childScope } : {}),
        orderBy: { name: "asc" },
      },
      // Content whose folderId === id only.
      contents: {
        ...(isStudent ? { where: { published: true } } : {}),
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!folder) {
    throw new Error("Folder not found.");
  }

  // A student may not open a folder outside their own grade/class.
  if (isStudent && !folderInStudentScope(folder, user!)) {
    throw new Error("Folder not found.");
  }

  return {
    success: true,
    data: folder,
  };
};

// Rename Folder
export const updateFolderService = async (
  id: string,
  data: { name?: string; gradeId?: string; classId?: string }
) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id,
    },
  });

  if (!folder) {
    throw new Error("Folder not found.");
  }

  const updatedFolder = await prisma.folder.update({
    where: {
      id,
    },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.gradeId && { gradeId: data.gradeId }),
      ...(data.classId && { classId: data.classId }),
    },
  });

  return {
    success: true,
    message: "Folder updated successfully.",
    data: updatedFolder,
  };
};

// Delete Folder
export const deleteFolderService = async (id: string) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id,
    },
  });

  if (!folder) {
    throw new Error("Folder not found.");
  }

  await prisma.folder.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
    message: "Folder deleted successfully.",
  };
};

// Get Folder Tree
export const getFolderTreeService = async () => {
  const folders = await prisma.folder.findMany({
    where: {
      parentId: null,
    },
    include: {
      children: {
        include: {
          children: {
            include: {
              children: true,
            },
          },
        },
      },
      contents: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return {
    success: true,
    data: folders,
  };
};