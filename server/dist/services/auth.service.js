import prisma from "../config/prisma.js";
import { Role } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
export const activateSchoolService = async (data) => {
    const { schoolName, adminName, email, password, activationCode, } = data;
    if (!schoolName ||
        !adminName ||
        !email ||
        !password ||
        !activationCode) {
        throw new Error("All fields are required.");
    }
    // Find activation code
    const code = await prisma.activationCode.findUnique({
        where: {
            code: activationCode,
        },
        include: {
            school: true,
        },
    });
    if (!code) {
        throw new Error("Invalid activation code.");
    }
    if (code.used) {
        throw new Error("Activation code already used.");
    }
    if (new Date() > code.expiresAt) {
        throw new Error("Activation code expired.");
    }
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) {
        throw new Error("Email already registered.");
    }
    const hashedPassword = await hashPassword(password);
    // Activate school
    await prisma.school.update({
        where: {
            id: code.schoolId,
        },
        data: {
            name: schoolName,
            isActive: true,
        },
    });
    // Create admin
    const admin = await prisma.user.create({
        data: {
            name: adminName,
            email,
            password: hashedPassword,
            role: Role.ADMIN,
            schoolId: code.schoolId,
        },
    });
    // Mark activation code used
    await prisma.activationCode.update({
        where: {
            id: code.id,
        },
        data: {
            used: true,
            usedAt: new Date(),
        },
    });
    const token = generateToken(admin.id, admin.role);
    return {
        success: true,
        message: "School activated successfully.",
        token,
        user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        },
    };
};
export const loginService = async (data) => {
    const { email, password } = data;
    if (!email || !password) {
        throw new Error("Email and password are required.");
    }
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new Error("Invalid email or password.");
    }
    const passwordMatched = await comparePassword(password, user.password);
    if (!passwordMatched) {
        throw new Error("Invalid email or password.");
    }
    const token = generateToken(user.id, user.role);
    return {
        success: true,
        message: "Login successful.",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            schoolId: user.schoolId,
            gradeId: user.gradeId,
            classId: user.classId,
        },
    };
};
