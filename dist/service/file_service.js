"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_uploader_1 = __importDefault(require("../util/cloudinary_uploader"));
const global_exception_1 = require("../util/global_exception");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const upload_image_cloudinary_handler = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const base64String = file.buffer.toString('base64');
        const dataUri = `data:${file.mimetype};base64,${base64String}`;
        return yield cloudinary_uploader_1.default.uploader.upload(dataUri, {
            folder: 'blog',
            public_id: `${Date.now()}`,
        });
    }
    catch (error) {
        console.log(error);
        throw new global_exception_1.InternalServerErrorException('Error uploading image');
    }
});
const upload_image = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const result = yield upload_image_cloudinary_handler(file);
        const file_db = yield prisma.file.create({
            data: {
                originalFilename: file.originalname,
                secureUrl: result.secure_url,
                bytes: result.bytes,
                format: result.format,
                resourceType: result.resource_type,
                cloudinaryId: result.public_id,
            }
        });
        res.status(200).json({ message: "Image uploaded successfully", file: file_db });
    }
    catch (error) {
        next(error);
    }
});
const get_image_by_id = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const file = yield prisma.file.findUnique({
            where: {
                id
            }
        });
        if (!file) {
            throw new global_exception_1.EntityNotFoundException(`File with id - ${id} not found`);
        }
        res.status(200).json({ message: "Success", file });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    upload_image, get_image_by_id
};
