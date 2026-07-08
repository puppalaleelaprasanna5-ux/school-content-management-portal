import prisma from "../config/prisma.js";

interface GradeData {
  name: string;
  schoolId: string;
}

// Create Grade
export const createGradeService = async (data: GradeData) => {
  const { name, schoolId } = data;

  if (!name || !schoolId) {
    throw new Error("Grade name and schoolId are required.");
  }

  const existingGrade = await prisma.grade.findFirst({
    where: {
      name,
      schoolId,
    },
  });

  if (existingGrade) {
    throw new Error("Grade already exists.");
  }

  const grade = await prisma.grade.create({
    data: {
      name,
      schoolId,
    },
  });

  return {
    success: true,
    message: "Grade created successfully.",
    data: grade,
  };
};

// Get All Grades
export const getGradesService = async () => {
  const grades = await prisma.grade.findMany({
    include: {
      classes: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    success: true,
    count: grades.length,
    data: grades,
  };
};

// Get Grade By ID
export const getGradeByIdService = async (id: string) => {
  const grade = await prisma.grade.findUnique({
    where: {
      id,
    },
    include: {
      classes: true,
      users: true,
    },
  });

  if (!grade) {
    throw new Error("Grade not found.");
  }

  return {
    success: true,
    data: grade,
  };
};

// Update Grade
export const updateGradeService = async (
  id: string,
  data: GradeData
) => {
  const grade = await prisma.grade.findUnique({
    where: {
      id,
    },
  });

  if (!grade) {
    throw new Error("Grade not found.");
  }

  const updatedGrade = await prisma.grade.update({
    where: {
      id,
    },
    data: {
      name: data.name,
    },
  });

  return {
    success: true,
    message: "Grade updated successfully.",
    data: updatedGrade,
  };
};

// Delete Grade
export const deleteGradeService = async (id: string) => {
  const grade = await prisma.grade.findUnique({
    where: {
      id,
    },
  });

  if (!grade) {
    throw new Error("Grade not found.");
  }

  await prisma.grade.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
    message: "Grade deleted successfully.",
  };
};