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
const user_schema_1 = __importDefault(require("../schema/user_schema"));
const client_1 = require("@prisma/client");
const token_1 = require("../util/token");
const bcrypt_1 = __importDefault(require("bcrypt"));
const global_exception_1 = require("../util/global_exception");
const class_transformer_1 = require("class-transformer");
const prisma = new client_1.PrismaClient();
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_data = user_schema_1.default.register.parse(req.body);
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const existingUser = yield prisma.user.findFirst({
                where: {
                    OR: [
                        { email: user_data.email },
                        { username: user_data.username },
                    ],
                },
            });
            if (existingUser != null) {
                if (existingUser.email == user_data.email) {
                    throw new global_exception_1.ConflictException('Email has been registered');
                }
                throw new global_exception_1.ConflictException('Username has been registered');
            }
            const hashed_password = yield bcrypt_1.default.hash(user_data.password, 10);
            const basicAuth = yield prisma.authority.findUnique({
                where: {
                    authority: "BASIC"
                }
            });
            if (basicAuth == null) {
                throw new global_exception_1.EntityNotFoundException(`Authority with role BASIC, NOT FOUND!`);
            }
            const user = yield tx.user.create({
                data: {
                    username: user_data.username,
                    email: user_data.email,
                    password: hashed_password
                }
            });
            yield tx.userAuthority.create({
                data: {
                    userId: user.id,
                    authorityId: basicAuth.id
                }
            });
            res.status(201).json({
                message: "Register successfull"
            });
        }));
    }
    catch (error) {
        next(error);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = user_schema_1.default.login.parse(req.body);
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const loggedUser = yield prisma.user.findUnique({
                where: { username: userData.username },
                include: { token: true }
            });
            if (!loggedUser) {
                throw new global_exception_1.UnauthorizedException('Wrong username or password!');
            }
            const isPasswordValid = yield bcrypt_1.default.compare(userData.password, loggedUser.password);
            if (!isPasswordValid) {
                throw new global_exception_1.UnauthorizedException('Wrong username or password!');
            }
            const accessToken = (0, token_1.generate_access_token)({
                userId: loggedUser.id,
            });
            const refreshToken = (0, token_1.generate_refresh_token)({
                userId: loggedUser.id,
            });
            if (loggedUser.token) {
                yield tx.userToken.update({
                    where: { userId: loggedUser.id },
                    data: {
                        refreshToken
                    },
                });
            }
            else {
                if (refreshToken != null) {
                    yield tx.userToken.create({
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
        }));
    }
    catch (error) {
        next(error);
    }
});
const get_personal_info = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDTO = (0, class_transformer_1.plainToClass)(user_schema_1.default.UserResponse, req.user, { excludeExtraneousValues: true });
        let user = Object.assign(Object.assign({}, userDTO), { authorities: req.authorities });
        res.status(200).json({ message: "SUCCESS!", user });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    register, login, get_personal_info
};
