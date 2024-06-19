"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_token = exports.has_any_authorities = exports.validateData = void 0;
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const global_exception_1 = require("../util/global_exception");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
function validateData(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => {
                    return `${issue.path.join('.')} is ${issue.message}`;
                });
                console.log(errorMessages);
                throw new global_exception_1.BadRequestException("MISSING DATA", errorMessages);
            }
            throw new global_exception_1.InternalServerErrorException("Internal Server Error");
        }
    };
}
exports.validateData = validateData;
function has_any_authorities(authorities) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            for (const e of authorities) {
                const index = req.authorities.find((el) => el.authority == e);
                if (index) {
                    console.log("This request is authorized");
                    return next();
                }
            }
            throw new global_exception_1.UnauthorizedException("Unauthorized!");
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.has_any_authorities = has_any_authorities;
const validate_token = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            throw new global_exception_1.UnauthorizedException("Authorization token missing");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            throw new global_exception_1.UnauthorizedException("Token expired");
        }
        const user = yield prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            console.log("Error from token, user with id " + decoded.userId + " NOT FOUND!");
            throw new global_exception_1.UnauthorizedException("Token invalid!");
        }
        const user_authorities = yield prisma.userAuthority.findMany({
            where: { userId: decoded.userId }
        });
        const authorities = [];
        for (const e of user_authorities) {
            const authority = yield prisma.authority.findUnique({ where: { id: e.authorityId } });
            if (authority) {
                authorities.push(authority);
            }
        }
        req.decoded = decoded;
        req.user = user;
        req.authorities = authorities;
        next();
    }
    catch (error) {
        console.error("Token validation error:", error);
        next(error);
    }
});
exports.validate_token = validate_token;
