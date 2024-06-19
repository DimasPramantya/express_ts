import express from "express";
import multer from "multer";

import file_service from "../service/file_service";
import { has_any_authorities, validate_token } from "../middleware/validation";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/upload", validate_token, has_any_authorities(['BASIC', 'ADMIN']), upload.single('image'), file_service.uploadImage);

router.get("/:id", validate_token, has_any_authorities(['BASIC', 'ADMIN']), file_service.getImageById);

export default router;