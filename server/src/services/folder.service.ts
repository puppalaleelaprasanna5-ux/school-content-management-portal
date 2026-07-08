import prisma from "../config/prisma.js";

interface FolderData {
  name: string;
  schoolId: string;
  createdById: string;
  gradeId?: string;
  classId?: string;
  parentId?: string;
}

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

// Get All Folders
export const getFoldersService = async () => {
  const folders = await prisma.folder.findMany({
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

// Get Folder By ID
export const getFolderByIdService = async (id: string) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id,
    },
    include: {
      school: true,
      grade: true,
      class: true,
      parent: true,
      children: true,
      contents: true,
      createdBy: true,
    },
  });

  if (!folder) {
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
  name: string
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
      name,
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