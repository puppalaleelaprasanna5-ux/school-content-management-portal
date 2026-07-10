import multer from "multer";
import path from "path";
import fs from "fs";
// Create upload folders automatically
const pdfDir = "uploads/pdfs";
const videoDir = "uploads/videos";
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}
if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination(_req, file, cb) {
        if (file.mimetype === "application/pdf") {
            cb(null, pdfDir);
        }
        else {
            cb(null, videoDir);
        }
    },
    filename(_req, file, cb) {
        const uniqueName = Date.now() +
            "-" +
            Math.round(Math.random() * 1000000);
        cb(null, uniqueName + path.extname(file.originalname));
    },
});
const fileFilter = (_req, file, cb) => {
    const allowed = [
        "application/pdf",
        "video/mp4",
        "video/webm",
        "video/quicktime",
    ];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Unsupported file type."));
    }
};
export default multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024,
    },
});
