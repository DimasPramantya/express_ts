import { NextFunction, Request, Response } from "express";
import { IHTTPError } from "../util/http_error";

export const exceptionHandler = (
    error: IHTTPError,
    req: Request,
    res: Response,
    _next: NextFunction 
) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error!";
    
    console.log("from exc handler " + error);

    return res.status(statusCode).send({ statusCode, message, data: error.data });
};