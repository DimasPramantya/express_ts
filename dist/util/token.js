"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_refresh_token = exports.generate_access_token = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generate_access_token = (payload) => {
    try {
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '30m' });
        return token;
    }
    catch (error) {
        console.log(`TOKEN ERROR: ${error}`);
    }
};
exports.generate_access_token = generate_access_token;
const generate_refresh_token = (payload) => {
    try {
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        return token;
    }
    catch (error) {
        console.log(`TOKEN ERROR: ${error}`);
    }
};
exports.generate_refresh_token = generate_refresh_token;
