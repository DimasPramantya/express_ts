"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityNotFoundException = exports.UnauthorizedException = exports.ConflictException = exports.InternalServerErrorException = exports.BadRequestException = void 0;
const http_status_code_1 = require("./http_status_code");
class BadRequestException extends Error {
    constructor(message, data) {
        super(message);
        this.statusCode = http_status_code_1.HTTPStatusCode.BadRequest;
        this.data = data;
    }
}
exports.BadRequestException = BadRequestException;
class InternalServerErrorException extends Error {
    constructor(message, data) {
        super(message || "Internal Server Error");
        this.statusCode = http_status_code_1.HTTPStatusCode.BadRequest;
        this.data = data !== null && data !== void 0 ? data : [];
    }
}
exports.InternalServerErrorException = InternalServerErrorException;
class ConflictException extends Error {
    constructor(message, data) {
        super(message || "Conflict");
        this.statusCode = http_status_code_1.HTTPStatusCode.BadRequest;
        this.data = data !== null && data !== void 0 ? data : [];
    }
}
exports.ConflictException = ConflictException;
class UnauthorizedException extends Error {
    constructor(message, data) {
        super(message || "Unauthorized");
        this.statusCode = http_status_code_1.HTTPStatusCode.Unauthorized;
        this.data = data !== null && data !== void 0 ? data : [];
    }
}
exports.UnauthorizedException = UnauthorizedException;
class EntityNotFoundException extends Error {
    constructor(message, data) {
        super(message || "Internal Server Error");
        this.statusCode = http_status_code_1.HTTPStatusCode.NotFound;
        this.data = data !== null && data !== void 0 ? data : [];
    }
}
exports.EntityNotFoundException = EntityNotFoundException;
