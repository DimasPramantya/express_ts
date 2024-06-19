import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Authority} from '@prisma/client'

import { CustomJwtPayload } from "../..";
import { BadRequestException, EntityNotFoundException, InternalServerErrorException, UnauthorizedException } from '../util/global_exception';
import prisma from '../util/prisma';

dotenv.config();

export function validateData(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try { 
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => {
                    return `${issue.path.join('.')} is ${issue.message}`;
                });
                console.log(errorMessages);
                throw new BadRequestException("INVALID DATA", errorMessages);
            }
            throw new InternalServerErrorException("Internal Server Error");
        }
    };
}

export function has_any_authorities(authorities: string[]) {
    return async(req: Request, res: Response, next: NextFunction) => {
        try {
            for(const e of authorities){
                const index = req.authorities.find((el)=>el.authority==e);
                if(index){
                    console.log("This request is authorized");
                    return next();
                }
            }
            throw new UnauthorizedException("Unauthorized!")
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

export const validate_token = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            throw new UnauthorizedException("Authorization token missing")
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;

        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            throw new UnauthorizedException("Token expired")
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            console.log("Error from token, user with id " + decoded.userId + " NOT FOUND!");
            throw new UnauthorizedException("Token invalid!");
        }

        const user_authorities = await prisma.userAuthority.findMany({
            where: { userId: decoded.userId }
        });

        const authorities: Authority[] = [];

        for (const e of user_authorities) {
            const authority = await prisma.authority.findUnique({ where: { id: e.authorityId } });
            if (authority) {
                authorities.push(authority);
            }
        }

        req.decoded = decoded;
        req.user = user;
        req.authorities = authorities;

        next();
    } catch (error) {
        console.error("Token validation error:", error);
        next(error)
    }
};