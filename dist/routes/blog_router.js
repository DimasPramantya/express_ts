"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validation_1 = require("../middleware/validation");
const blog_schema_1 = __importDefault(require("../schema/blog_schema"));
const blog_service_1 = __importDefault(require("../service/blog_service"));
const router = express_1.default.Router();
router.post("", validation_1.validate_token, (0, validation_1.has_any_authorities)(["ADMIN"]), (0, validation_1.validateData)(blog_schema_1.default.create), blog_service_1.default.add_blog);
router.get("", blog_service_1.default.get_all_blog);
router.get("/:id", blog_service_1.default.get_blog_by_id);
router.delete("/:id", validation_1.validate_token, (0, validation_1.has_any_authorities)(["ADMIN"]), blog_service_1.default.delete_blog);
router.put("", validation_1.validate_token, (0, validation_1.has_any_authorities)(["ADMIN"]), (0, validation_1.validateData)(blog_schema_1.default.update), blog_service_1.default.update_blog);
router.get("/users/me", validation_1.validate_token, (0, validation_1.has_any_authorities)(["ADMIN"]), blog_service_1.default.get_blog_by_author);
exports.default = router;
