"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ck editor 
// handler buat file atau gambar
// express async error
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const yamljs_1 = __importDefault(require("yamljs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const client_1 = require("@prisma/client");
//ubah jadi routes
const principal_router_1 = __importDefault(require("./routes/principal_router"));
const user_router_1 = __importDefault(require("./routes/user_router"));
const file_router_1 = __importDefault(require("./routes/file_router"));
const blog_router_1 = __importDefault(require("./routes/blog_router"));
const exception_1 = require("./middleware/exception");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, '..', 'docs.yaml'));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.get('/docs.yaml', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'docs.yaml'));
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/principal", principal_router_1.default);
app.use("/user", user_router_1.default);
app.use("/file", file_router_1.default);
app.use("/blog", blog_router_1.default);
app.use(exception_1.exceptionHandler);
app.get("/public", (req, res, next) => {
    res.json({
        message: "Hello World"
    });
});
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});
