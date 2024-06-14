"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const create = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    fileId: zod_1.z.string(),
});
const update = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    fileId: zod_1.z.string(),
});
exports.default = {
    create, update
};
