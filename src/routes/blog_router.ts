import express from "express";
import multer from "multer";
import { has_any_authorities, validate_token, validateData } from "../middleware/validation";
import blog_schema from "../schema/blog_schema";

import blog_service from "../service/blog_service";

const router = express.Router();

router.post("", validate_token, has_any_authorities(["ADMIN"]), validateData(blog_schema.create), blog_service.addBlog);

router.get("", blog_service.getAllBlog);

router.get("/:id", blog_service.getBlogById);

router.delete("/:id", validate_token, has_any_authorities(["ADMIN"]), blog_service.deleteBlog);

router.put("", validate_token, has_any_authorities(["ADMIN"]), validateData(blog_schema.update), blog_service.updateBlog);

router.get("/users/me", validate_token, has_any_authorities(["ADMIN"]), blog_service.getBlogByAuthor);

export default router;

