import express from "express";
import multer from "multer";
import { has_any_authorities, validate_token, validateData } from "../middleware/validation";
import blog_schema from "../schema/blog_schema";

import blog_service from "../service/blog_service";

const router = express.Router();

router.post("", validate_token, has_any_authorities(["ADMIN"]), validateData(blog_schema.create), blog_service.add_blog);

export default router;

