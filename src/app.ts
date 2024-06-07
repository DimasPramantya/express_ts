// ck editor 
// handler buat file atau gambar
// express async error
import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client'
//ubah jadi routes
import principal_controller from './routes/principal_router'
import user_controller from './routes/user_router'
const prisma = new PrismaClient()

dotenv.config();

const PORT = process.env.PORT || 8080;

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/principal", principal_controller);
app.use("/user",user_controller);
//blog
//app.use('/blog', blog_controller)

app.get("/public", (req: Request, res: Response, next: NextFunction)=>{
    res.json({
        message: "Hello World"
    });
})

app.listen(PORT, ()=>{
    console.log(`Server is listening on PORT ${PORT}`);
})