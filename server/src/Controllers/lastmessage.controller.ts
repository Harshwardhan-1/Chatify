import {Request,Response,NextFunction} from 'express';
import { lastMessageModel } from "../models/conversion.model";
import { authRequest } from '../types/authRequest.type';
export const handleConversion=async(senderId:string,receiverId:string,message:string)=>{
try{
    const checkConversion=await lastMessageModel.findOne({
            participants:{$all:[senderId,receiverId]}
        })
        if(checkConversion){
           checkConversion.message=message;
           await checkConversion.save();
        }else{
            const createConversion=await lastMessageModel.create({
                participants:[senderId,receiverId],
                message:message,       
            });
        }
}catch(err){
    throw err;
}
}






export const userAllConversion=async(req:authRequest,res:Response,next:NextFunction)=>{
try{
    const user=req?.user;
    const currentUserId=user?._id;
    if(!currentUserId){
        return res.status(400).json({
            success:false,
            message:"user token expired",
        });
    }
    const allConversion=await lastMessageModel.find({
        participants:currentUserId
    });
    return res.status(200).json({
        success:true,
        message:"all conversion",
        data:allConversion,
    })
}catch(err){
    next(err);
}
}