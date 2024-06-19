"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_service_1 = __importDefault(require("../service/user_service"));
const validation_1 = require("../middleware/validation");
const user_schema_1 = __importDefault(require("../schema/user_schema"));
const router = express_1.default.Router();
router.post("/register", (0, validation_1.validateData)(user_schema_1.default.register), user_service_1.default.register);
router.post("/login", (0, validation_1.validateData)(user_schema_1.default.login), user_service_1.default.login);
exports.default = router;
