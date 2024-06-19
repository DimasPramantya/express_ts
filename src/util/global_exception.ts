import { HTTPStatusCode } from './http_status_code';
import { IHTTPError } from './http_error';
import createHttpError from 'http-errors';

export class BadRequestException extends Error implements IHTTPError {
    statusCode: number;
    data: string[];

    constructor(message: string, data: string[]) {
        super(message);
        this.statusCode = HTTPStatusCode.BadRequest;
        this.data = data;
    }
}

export class InternalServerErrorException extends Error implements IHTTPError {
    statusCode: number;
    data: string[];

    constructor(message: string, data?: string[]) {
        super(message || "Internal Server Error");
        this.statusCode = HTTPStatusCode.BadRequest;
        this.data = data ?? [];
    }
}

export class ConflictException extends Error implements IHTTPError {
    statusCode: number;
    data: string[];

    constructor(message: string, data?: string[]) {
        super(message || "Conflict");
        this.statusCode = HTTPStatusCode.BadRequest;
        this.data = data ?? [];
    }
}

export class UnauthorizedException extends Error implements IHTTPError {
    statusCode: number;
    data: string[];

    constructor(message: string, data?: string[]) {
        super(message || "Unauthorized");
        this.statusCode = HTTPStatusCode.Unauthorized;
        this.data = data ?? [];
    }
}

export class EntityNotFoundException extends Error implements IHTTPError {
    statusCode: number;
    data: string[];

    constructor(message: string, data?: string[]) {
        super(message || "Internal Server Error");
        this.statusCode = HTTPStatusCode.NotFound;
        this.data = data ?? [];
    }
}

