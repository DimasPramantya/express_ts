import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { CustomJwtPayload } from "../..";
dotenv.config();

export function generate_access_token(payload: Object){
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: '30m'})
        return token
    } catch (error) {
        console.log(`TOKEN ERROR: ${error}`);
    }
}

export function generate_refresh_token(payload: Object){
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: '7d'})
        return token
    } catch (error) {
        console.log(`TOKEN ERROR: ${error}`);
    }
}
