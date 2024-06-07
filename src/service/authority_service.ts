import { NextFunction, Request, Response } from "express";

import { PrismaClient } from '@prisma/client'
import { generate_access_token, generate_refresh_token } from "../util/token";

const prisma = new PrismaClient()

const addAuthority = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const user = await prisma.user.findUnique({
            where: {id: req.decoded?.userId},
            include: { userAuthorities: true }
        })
        if(user==null){
            res.status(404).json({
                message: `User dengan id - ${req.decoded?.userId} tidak ditemukan!`
            })
        }
       
    } catch (error) {
        
    }
}