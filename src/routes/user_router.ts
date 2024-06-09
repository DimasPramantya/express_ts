import express from "express";
import userService from "../service/user_service";
import { has_any_authorities, validate_token } from "../middleware/validation"; 

const router = express.Router();

router.get("/me", validate_token, has_any_authorities(['BASIC']), userService.get_personal_info)

export default router;  