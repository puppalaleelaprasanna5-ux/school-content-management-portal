import prisma from "../config/prisma.js";

interface CreateStudentData {
  name: string;
  email: string;
  password: string;
  schoolId: string;
  gradeId?: string;
  classId?: string;
}

// Create Student
export const createStudentService = async (data: CreateStudentData) => {
  const { name, email, password, schoolId, gradeId, classId } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  const student = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role: "STUDENT",
      schoolId,
      gradeId,
      classId,
    },
  });

  return {
    success: true,
    message: "Student created successfully.",
    data: student,
  };
};

// Get All Students
export const getStudentsService = async () => {
  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
    },
    include: {
      school: true,
      grade: true,
      class: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    success: true,
    count: students.length,
    data: students,
  };
};

// Get Student By ID
export const getStudentByIdService = async (id: string) => {
  const student = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      school: true,
      grade: true,
      class: true,
    },
  });

  if (!student) {
    throw new Error("Student not found.");
  }

  return {
    success: true,
    data: student,
  };
};

// Update Student
export const updateStudentService = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    gradeId?: string;
    classId?: string;
  }
) => {
  const student = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!student) {
    throw new Error("Student not found.");
  }

  if (data.email && data.email !== student.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists.");
    }
  }

  const updatedStudent = await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.gradeId !== undefined && { gradeId: data.gradeId || null }),
      ...(data.classId !== undefined && { classId: data.classId || null }),
    },
  });

  return {
    success: true,
    message: "Student updated successfully.",
    data: updatedStudent,
  };
};

// Delete Student
export const deleteStudentService = async (id: string) => {
  const student = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!student) {
    throw new Error("Student not found.");
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
    message: "Student deleted successfully.",
  };
};
