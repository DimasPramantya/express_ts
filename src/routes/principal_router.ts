import express from "express";
import userService from "../service/user_service";

const router = express.Router();

router.post("/register", userService.register);

router.post("/login", userService.login);


export default router;