import prisma from "../config/prisma.js";

interface CreateActivityData {
  type: string;
  title: string;
  description: string;
  userId: string;
  schoolId: string;
  metadata?: any;
}

// Create Activity Log
export const createActivityService = async (data: CreateActivityData) => {
  const { type, title, description, userId, schoolId, metadata } = data;

  const activity = await prisma.activity.create({
    data: {
      type,
      title,
      description,
      userId,
      schoolId,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });

  return {
    success: true,
    data: activity,
  };
};

// Get All Activities (with pagination)
export const getActivitiesService = async (schoolId: string, limit: number = 50, offset: number = 0) => {
  const activities = await prisma.activity.findMany({
    where: {
      schoolId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
  });

  const total = await prisma.activity.count({
    where: {
      schoolId,
    },
  });

  return {
    success: true,
    count: activities.length,
    total,
    data: activities,
  };
};

// Get Recent Activities (for dashboard)
export const getRecentActivitiesService = async (schoolId: string, limit: number = 5) => {
  const activities = await prisma.activity.findMany({
    where: {
      schoolId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return {
    success: true,
    data: activities,
  };
};
