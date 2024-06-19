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
import principalRouter from './routes/principal_router'
import userRouter from './routes/user_router'
import fileRouter from './routes/file_router'
import blogRouter from './routes/blog_router'
import { exceptionHandler } from "./middleware/exception";
import cors from 'cors';
const prisma = new PrismaClient()

//jsend

dotenv.config();

const PORT = process.env.PORT || 8080;

const app: Express = express();

const swaggerDocument = YAML.load(path.join(__dirname, '..', 'docs.yaml')); 

const options: cors.CorsOptions = {
    origin: '*'
};

app.use(cors(options));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/docs.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'docs.yaml'));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/principal", principalRouter);
app.use("/user",userRouter);
app.use("/file", fileRouter);
app.use("/blog", blogRouter);
app.use(exceptionHandler);

app.get("/public", (req: Request, res: Response, next: NextFunction)=>{
    res.json({
        message: "Hello World"
    });
})

app.listen(PORT, ()=>{
    console.log(`Server is listening on PORT ${PORT}`);
})