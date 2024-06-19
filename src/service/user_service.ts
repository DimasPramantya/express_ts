import { NextFunction, Request, Response } from "express";
import UserSchema from "../schema/user_schema";

import { PrismaClient } from '@prisma/client'
import { generateAccessToken, generateRefreshToken } from "../util/token";

import bcrypt from 'bcrypt'
import { ConflictException, EntityNotFoundException, UnauthorizedException } from "../util/global_exception";
import { plainToClass } from "class-transformer";

const prisma = new PrismaClient()

async function register(req: Request, res: Response, next: NextFunction){
    try {
        const user_data = UserSchema.register.parse(req.body);
        await prisma.$transaction(async(tx)=>{
            const existingUser = await tx.user.findFirst({
                where: {
                    OR: [
                        { email: user_data.email },
                        { username: user_data.username },
                    ],
                },
            });
    
            if (existingUser != null) {
                if (existingUser.email == user_data.email) {
                    throw new ConflictException('Email has been registered');
                }
                throw new ConflictException('Username has been registered');
            }
    
            const hashed_password = await bcrypt.hash(user_data.password, 10);
    
            
            const basicAuth = await tx.authority.findUnique({
                where: {
                    authority: "BASIC"
                }
            })
    
            if(basicAuth == null){
                throw new EntityNotFoundException(`Authority with role BASIC, NOT FOUND!`)
            }
    
            const user = await tx.user.create({
                data: {
                    username: user_data.username,
                    email: user_data.email,
                    password: hashed_password
                }
            })
    
            await tx.userAuthority.create({
                data: {
                    userId: user.id,
                    authorityId: basicAuth.id
                }
            })
    
            res.status(201).json({
                message: "Register successfull"
            })
        })
    } catch (error) {
        next(error)
    }
}

async function login(req: Request, res: Response, next: NextFunction){
    try {
        const userData = UserSchema.login.parse(req.body);

        await prisma.$transaction(async(tx)=>{
            const loggedUser = await tx.user.findUnique({ 
                where: { username: userData.username },
                include: { token: true }
            });
    
            if (!loggedUser) {
                throw new UnauthorizedException('Wrong username or password!')
            }
    
            const isPasswordValid = await bcrypt.compare(userData.password, loggedUser.password);
            if (!isPasswordValid) {
               throw new UnauthorizedException('Wrong username or password!');
            }
    
            const accessToken = generateAccessToken({
                userId: loggedUser.id,
            });
            
            const refreshToken = generateRefreshToken({
                userId: loggedUser.id,
            });
    
            if (loggedUser.token) {
                await tx.userToken.update({
                    where: { userId: loggedUser.id },
                    data: {
                        refreshToken
                    },
                });
            } else {
                if(refreshToken !=null){
                    await tx.userToken.create({
                        data: {
                            user: { connect: { id: loggedUser.id } },
                            refreshToken: refreshToken
                        },
                    });
                }
            }
    
            res.json({
                accessToken,
                refreshToken,
                message: "Login successful",
            });
        })
    } catch (error: unknown) {
        next(error)
    }
};

async function getPersonalInfo(req: Request, res: Response, next: NextFunction){
    try {
        const userDTO = plainToClass(UserSchema.UserResponse, req.user, { excludeExtraneousValues: true });
        let user = {...userDTO, authorities: req.authorities}
        res.status(200).json({message: "SUCCESS!", user})
    } catch (error) {
        next(error);
    }
}

export default {
    register, login, getPersonalInfo
}