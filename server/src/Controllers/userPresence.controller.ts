import { userPresenceModel } from "../models/userPresence.model";
import {Request,Response,NextFunction} from 'express';


export const userPresence=async(userId:string)=>{
try{
const findLastTime=await userPresenceModel.findOne({userId});
if(findLastTime){
     findLastTime.lastSeen=new Date();
     await findLastTime.save();
     return findLastTime.lastSeen;
}else{
    const createIt=await userPresenceModel.create({
        userId,
        lastSeen:new Date(),
    });
    return createIt.lastSeen;
}
}catch(err){
    throw err;
}
}