import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "schoolcmssecret123";
export const generateToken = (id, role) => {
    return jwt.sign({
        id,
        role,
    }, JWT_SECRET, {
        expiresIn: "7d",
    });
};
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
