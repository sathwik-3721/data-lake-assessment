import { test, uploadFile, previewFile } from "../controllers/dataLake.controller.js";
import express from "express";
import multer from 'multer';
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("objects __dirname : ", __dirname);

const uploadDir = path.join(__dirname, '..', 'controllers', 'uploads');
console.log("objects uploadDir : ", uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use original name + timestamp to avoid collisions, keep extension
    const now = new Date();
    const timestamp =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      'T' +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');

    const extension = path.extname(file.originalname);
    const filename = `file-${timestamp}${extension}`;

    cb(null, filename);
  },
});
const upload = multer({ storage: storage });
router.route("/test").get(test);
router.route('/upload').post(upload.single('file'), uploadFile);
router.route("/preview").get(previewFile);

export default router;
