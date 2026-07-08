import prisma from "../config/prisma.js";

interface ClassData {
  name: string;
  gradeId: string;
}

// Create Class
export const createClassService = async (data: ClassData) => {
  const { name, gradeId } = data;

  if (!name || !gradeId) {
    throw new Error("Class name and gradeId are required.");
  }

  const existing = await prisma.classSection.findFirst({
    where: {
      name,
      gradeId,
    },
  });

  if (existing) {
    throw new Error("Class already exists.");
  }

  const classSection = await prisma.classSection.create({
    data: {
      name,
      gradeId,
    },
  });

  return {
    success: true,
    message: "Class created successfully.",
    data: classSection,
  };
};

// Get All Classes
export const getClassesService = async () => {
  const classes = await prisma.classSection.findMany({
    include: {
      grade: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    success: true,
    count: classes.length,
    data: classes,
  };
};

// Get Class By ID
export const getClassByIdService = async (id: string) => {
  const classSection = await prisma.classSection.findUnique({
    where: { id },
    include: {
      grade: true,
      users: true,
    },
  });

  if (!classSection) {
    throw new Error("Class not found.");
  }

  return {
    success: true,
    data: classSection,
  };
};

// Update Class
export const updateClassService = async (
  id: string,
  data: Partial<ClassData>
) => {
  const existing = await prisma.classSection.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Class not found.");
  }

  const updated = await prisma.classSection.update({
    where: { id },
    data: {
      name: data.name,
    },
  });

  return {
    success: true,
    message: "Class updated successfully.",
    data: updated,
  };
};

// Delete Class
export const deleteClassService = async (id: string) => {
  const existing = await prisma.classSection.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Class not found.");
  }

  await prisma.classSection.delete({
    where: { id },
  });

  return {
    success: true,
    message: "Class deleted successfully.",
  };
};