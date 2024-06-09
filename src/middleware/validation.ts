import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

import { BadRequestException, InternalServerErrorException } from '../util/global_exception';

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
                throw new BadRequestException("MISSING DATA", errorMessages);
            }
            throw new InternalServerErrorException("Internal Server Error");
        }
    };
}