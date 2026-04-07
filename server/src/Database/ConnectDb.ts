import mongoose from "mongoose";
import { MONGO_URL } from "../configs/env.config";
export const connectDb=async():Promise<void>=>{
    try{
        await mongoose.connect(MONGO_URL as string);
        console.log('MongoDb connected');
    }catch(err){
        console.log('mongoDb connection failed',err);
        process.exit(1);
    }
};