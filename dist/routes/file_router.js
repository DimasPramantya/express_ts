"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const file_service_1 = __importDefault(require("../service/file_service"));
const validation_1 = require("../middleware/validation");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = express_1.default.Router();
router.post("/upload", validation_1.validate_token, (0, validation_1.has_any_authorities)(['BASIC', 'ADMIN']), upload.single('image'), file_service_1.default.upload_image);
router.get("/:id", validation_1.validate_token, (0, validation_1.has_any_authorities)(['BASIC', 'ADMIN']), file_service_1.default.get_image_by_id);
exports.default = router;
