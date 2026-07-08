import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import gradeRoutes from "./routes/grade.routes.js";
import classRoutes from "./routes/class.routes.js";
import folderRoutes from "./routes/folder.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("🚀 School CMS Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/folders", folderRoutes);

export default app;