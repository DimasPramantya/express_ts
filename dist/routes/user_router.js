"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_service_1 = __importDefault(require("../service/user_service"));
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get("/me", validation_1.validate_token, (0, validation_1.has_any_authorities)(['BASIC']), user_service_1.default.get_personal_info);
exports.default = router;
