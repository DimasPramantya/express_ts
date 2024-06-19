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
const global_exception_1 = require("../util/global_exception");
const client_1 = require("@prisma/client");
const blog_schema_1 = __importDefault(require("../schema/blog_schema"));
const cloudinary_uploader_1 = __importDefault(require("../util/cloudinary_uploader"));
const prisma = new client_1.PrismaClient();
const add_blog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog_data = blog_schema_1.default.create.parse(req.body);
        const file = yield prisma.file.findUnique({ where: { id: blog_data.fileId } });
        if (file != null && req.user != null) {
            const blog = yield prisma.blog.create({
                data: {
                    title: blog_data.title,
                    content: blog_data.content,
                    authorId: req.user.id,
                    fileId: blog_data.fileId,
                    imageUrl: file.secureUrl
                }
            });
            res.status(200).json({ message: "Blog created successfully", blog });
        }
        throw new global_exception_1.EntityNotFoundException("File not found");
    }
    catch (error) {
        next(error);
    }
});
const get_all_blog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        if (limit > 200) {
            throw new global_exception_1.BadRequestException("Item Exceeded", ["Limit cannot be more than 200"]);
        }
        const skip = (page - 1) * limit;
        if (skip > 200) {
            throw new global_exception_1.BadRequestException("Item Exceeded", ["Fetch element cannot be more than 200"]);
        }
        const search = req.query.search;
        const searchCondition = search
            ? {
                title: {
                    search: search,
                },
            }
            : {};
        const totalBlogs = yield prisma.blog.count();
        const blogs = yield prisma.blog.findMany({
            skip,
            take: limit,
            include: { author: { select: { username: true } } }
        });
        const totalPages = Math.ceil(totalBlogs / limit);
        res.status(200).json({
            totalBlogs,
            totalPages,
            currentPage: page,
            blogs,
        });
    }
    catch (error) {
        next(error);
    }
});
const get_blog_by_id = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const blog = yield prisma.blog.findUnique({
            where: { id },
            include: { author: { select: { username: true } } }
        });
        if (!blog) {
            throw new global_exception_1.EntityNotFoundException(`Blog with id - ${id} not found`);
        }
        res.status(200).json({ message: "Success", blog });
    }
    catch (error) {
        next(error);
    }
});
const delete_blog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const blog = yield prisma.blog.findUnique({ where: { id } });
        if (blog == null) {
            throw new global_exception_1.EntityNotFoundException(`Blog with id - ${id} not found`);
        }
        const file = yield prisma.file.findUnique({ where: { id: blog.fileId } });
        if (file != null) {
            yield cloudinary_uploader_1.default.uploader.destroy(file.cloudinaryId);
        }
        yield prisma.blog.delete({
            where: { id }
        });
        res.status(200).json({ message: "Delete Blog Success" });
    }
    catch (error) {
        next(error);
    }
});
const update_blog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog_data = blog_schema_1.default.update.parse(req.body);
        const file = yield prisma.file.findUnique({ where: { id: blog_data.fileId } });
        if (!file) {
            throw new global_exception_1.EntityNotFoundException("File not found");
        }
        const blog_db = yield prisma.blog.update({
            where: { id: blog_data.id },
            data: {
                title: blog_data.title,
                content: blog_data.content,
                imageUrl: file === null || file === void 0 ? void 0 : file.secureUrl,
                fileId: blog_data.fileId
            }
        });
        res.status(200).json({ message: "Update Blog Success", blog: blog_db });
    }
    catch (error) {
        next(error);
    }
});
const get_blog_by_author = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalBlogs = yield prisma.blog.count();
        const blogs = yield prisma.blog.findMany({
            skip,
            take: limit,
            include: { author: { select: { username: true } } },
            where: { authorId: req.user.id }
        });
        const totalPages = Math.ceil(totalBlogs / limit);
        res.status(200).json({
            totalBlogs,
            totalPages,
            currentPage: page,
            blogs,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    add_blog, get_all_blog, get_blog_by_id, delete_blog, update_blog, get_blog_by_author
};
