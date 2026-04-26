import express  , {Request , Response,NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { FRONTEND_URL } from "./configs/env.config";
import { errorMiddleware } from "./middleware/error.middleware";
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
  origin:FRONTEND_URL,
  methods:["GET","POST","PUT","DELETE"],
  credentials:true,
}))
app.get("/",(req:Request,res:Response)=>{
  res.send("hii harsh here");
})
app.get("/test",(req:Request,res:Response)=>{
  return res.status(200).json({
    success:true,
    message:"test successfull",
  })
})
import userRoutes from "./Routes/userRoutes";
import { userChat } from "./Routes/chat.routes";
import { userlastMessage } from "./Routes/lastmessage.routes";
app.use('/uploads',express.static("uploads"));
app.use('/api/v1',userRoutes);
app.use('/api/v1',userChat);
app.use('/api/v1',userlastMessage);
app.use(errorMiddleware);

export default app;