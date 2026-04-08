import express  , {Request , Response} from "express";
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
import userRoutes from "./Routes/userRoutes";
import { userChat } from "./Routes/chat.routes";
import { userLastMessages } from "./Routes/last.message.routes";

app.use('/uploads',express.static("uploads"));
app.use('/api/v1',userRoutes);
app.use('/api/v1',userChat);
app.use('/api/v1',userLastMessages);
app.use(errorMiddleware);

export default app;