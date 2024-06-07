import { NextFunction, Request, Response } from "express";
import UserSchema from "../dto/user_dto";

import { PrismaClient } from '@prisma/client'
import { generate_access_token, generate_refresh_token } from "../util/token";

import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_data = UserSchema.register.parse(req.body);

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: user_data.email },
                    { username: user_data.username },
                ],
            },
        });

        if (existingUser != null) {
            if (existingUser.email == user_data.email) {
                res.status(409).json({
                    message: `Email has been registered!`
                })
            }
            res.status(409).json({
                message: `Username has been registered!`
            })
        }

        const hashed_password = await bcrypt.hash(user_data.password, 10);

        const user = await prisma.user.create({
            data: {
                username: user_data.username,
                email: user_data.email,
                password: hashed_password
            }
        })

        res.status(201).json({
            message: "Register successfull"
        })
    } catch (error) {
        console.log(`Internal Server Error: ${error}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = UserSchema.login.parse(req.body);

        const loggedUser = await prisma.user.findUnique({ 
            where: { username: userData.username },
            include: { token: true }
        });

        if (!loggedUser) {
            return res.status(401).json({ message: "Wrong username or password!" }); 
        }

        const isPasswordValid = await bcrypt.compare(userData.password, loggedUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Wrong username or password!" });
        }

        const accessToken = generate_access_token({
            userId: loggedUser.id,
        });
        
        const refreshToken = generate_refresh_token({
            userId: loggedUser.id,
        });

        if (loggedUser.token) {
            await prisma.userToken.update({
                where: { userId: loggedUser.id },
                data: {
                    accessToken
                },
            });
        } else {
            if(accessToken !=null){
                await prisma.userToken.create({
                    data: {
                        user: { connect: { id: loggedUser.id } },
                        accessToken: accessToken
                    },
                });
            }
        }

        res.json({
            accessToken,
            refreshToken,
            message: "Login successful",
        });
    } catch (error: unknown) {
        console.error("Login error:", error); 
        res.status(500).json({ message: "Internal server error" });
    }
};

const get_personal_info = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const user = await prisma.user.findUnique({
            where: {id: req.decoded?.userId},
            include: { userAuthorities: { include: { authority: true } } },
        })
        if(user){

        }
    } catch (error) {
        console.error("error:", error); 
        res.status(500).json({ message: "Internal server error" });
    }
}

export default {
    register, login
}