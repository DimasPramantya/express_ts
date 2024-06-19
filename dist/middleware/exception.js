"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exceptionHandler = void 0;
const exceptionHandler = (error, req, res, _next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error!";
    console.log("from exc handler " + error);
    return res.status(statusCode).send({ statusCode, message, data: error.data });
};
exports.exceptionHandler = exceptionHandler;
