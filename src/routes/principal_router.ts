import express from "express";
import userService from "../service/user_service";
import { validateData } from "../middleware/validation";
import user_schema from "../schema/user_schema";

const router = express.Router();

router.post("/register", validateData(user_schema.register), userService.register);

router.post("/login", validateData(user_schema.login), userService.login);

export default router;