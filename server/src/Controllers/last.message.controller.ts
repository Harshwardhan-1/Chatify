import {Request,Response,NextFunction} from 'express';
import { authRequest } from '../types/authRequest.type';
import { conversionModel } from '../models/conversion.model';
import { checkUserId } from '../validation/user.id.validation';


export const lastMessage=async(req:authRequest,res:Response,next:NextFunction)=>{
try{
    const user=req.user;
    const userId=user?._id.toString();
    const currentUserId=user?._id;
    const parsed=checkUserId.safeParse({
        currentUserId:userId,
    });
    if(!parsed.success){
        const issue=parsed.error.issues[0];
        return res.status(400).json({
            success:false,
            message:issue.message,
        });
    }
    const getAllConversion=await conversionModel.find({
    participants:currentUserId,
    });
    return res.status(200).json({
        success:true,
        message:"successfull",
        data:getAllConversion,
    })
}catch(err){
    next(err);
}
}