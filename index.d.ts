import * as jwt from 'jsonwebtoken';
import * as express from 'express-serve-static-core'
import { User, Authority } from '@prisma/client';

interface CustomJwtPayload extends jwt.JwtPayload {
    userId: string;
}

declare global{
    namespace Express{
        interface Request {
            decoded: CustomJwtPayload;
            user: User,
            authorities: Authority[]
        }
    }
}