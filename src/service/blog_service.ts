import { EntityNotFoundException, InternalServerErrorException } from "../util/global_exception";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const add_blog = async(req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        
    }
}

export default {
    add_blog
}