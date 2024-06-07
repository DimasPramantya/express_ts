import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { CustomJwtPayload } from "../..";
dotenv.config();

export const generate_access_token = (payload: Object)=>{
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: '30m'})
        return token
    } catch (error) {
        console.log(`TOKEN ERROR: ${error}`);
    }
}

export const generate_refresh_token = (payload: Object)=>{
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: '7d'})
        return token
    } catch (error) {
        console.log(`TOKEN ERROR: ${error}`);
    }
}

export const validate_token = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1]; 

        if (!token) {
            return res.status(401).json({ message: "Authorization token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;

        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ message: "Token expired" });
        }

        req.decoded = decoded; 

        next(); 
    } catch (error) {
        console.error("Token validation error:", error);
        return res.status(403).json({ message: "Invalid token" }); 
    }
};