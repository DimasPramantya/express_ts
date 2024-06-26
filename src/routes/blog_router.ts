import express from "express";
import multer from "multer";
import { has_any_authorities, validate_token, validateData } from "../middleware/validation";
import blog_schema from "../schema/blog_schema";

import blog_service from "../service/blog_service";

const router = express.Router();

router.post("", validate_token, has_any_authorities(["ADMIN"]), validateData(blog_schema.create), blog_service.add_blog);

router.get("", blog_service.get_all_blog);

router.get("/:id", blog_service.get_blog_by_id);

router.delete("/:id", validate_token, has_any_authorities(["ADMIN"]), blog_service.delete_blog);

router.put("", validate_token, has_any_authorities(["ADMIN"]), validateData(blog_schema.update), blog_service.update_blog);

router.get("/users/me", validate_token, has_any_authorities(["ADMIN"]), blog_service.get_blog_by_author);

export default router;

