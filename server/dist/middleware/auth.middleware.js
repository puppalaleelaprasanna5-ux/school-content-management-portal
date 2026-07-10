import prisma from "../config/prisma.js";
import { verifyToken } from "../utils/jwt.js";
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Access token missing.",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found.",
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token.",
        });
    }
};
