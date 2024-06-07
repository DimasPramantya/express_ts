import * as jwt from 'jsonwebtoken';
import * as express from 'express-serve-static-core'

interface CustomJwtPayload extends jwt.JwtPayload {
    userId: string;
}

declare global{
    namespace Express{
        interface Request {
            decoded?: CustomJwtPayload;
        }
    }
}