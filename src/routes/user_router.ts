import express from "express";
import userService from "../service/user_service";
import { validate_token } from "../util/token";

const router = express.Router();

router.get("/me", validate_token, )

export default router; 