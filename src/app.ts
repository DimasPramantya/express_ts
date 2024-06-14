// ck editor 
// handler buat file atau gambar
// express async error
import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import path from "path";
import YAML from "yamljs"; 
import swaggerUi from "swagger-ui-express"; 
import { PrismaClient } from '@prisma/client'
//ubah jadi routes
import principal_router from './routes/principal_router'
import user_router from './routes/user_router'
import file_router from './routes/file_router'
import blog_router from './routes/blog_router'
import { exceptionHandler } from "./middleware/exception";
const prisma = new PrismaClient()

dotenv.config();

const PORT = process.env.PORT || 8080;


const app: Express = express();

const swaggerDocument = YAML.load(path.join(__dirname, '..', 'docs.yaml')); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/docs.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'docs.yaml'));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/principal", principal_router);
app.use("/user",user_router);
app.use("/file", file_router);
app.use("/blog", blog_router);
app.use(exceptionHandler);

app.get("/public", (req: Request, res: Response, next: NextFunction)=>{
    res.json({
        message: "Hello World"
    });
})

app.listen(PORT, ()=>{
    console.log(`Server is listening on PORT ${PORT}`);
})