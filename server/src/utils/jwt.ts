import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "schoolcmssecret123";

export const generateToken = (
  id: string,
  role: string
): string => {
  return jwt.sign(
    {
      id,
      role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};