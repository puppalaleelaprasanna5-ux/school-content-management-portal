import prisma from "../config/prisma.js";
// Create PDF / Video / Text Content
export const createContentService = async (data) => {
    const { title, description, type, folderId, uploadedById, filePath, textContent, } = data;
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
export const getContentByIdService = async (id) => {
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
export const updateContentService = async (id, data) => {
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
export const deleteContentService = async (id) => {
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
