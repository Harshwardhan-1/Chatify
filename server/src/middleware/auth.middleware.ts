import {Request,Response,NextFunction} from 'express';
import { addUserModel } from '../models/userModel';
import { JWT_SECRET } from '../configs/env.config';
import {authRequest, userPlayLoad } from '../types/authRequest.type';
import jwt from 'jsonwebtoken';

export const isUserLoggedIn=async(req:authRequest,res:Response,next:NextFunction)=>{
    try{ 
    const token=req.cookies?.token;
    if(!token){
        return res.status(401).json({
            message:"token not found",
        });
    }
    const decodedData=jwt.verify(token,JWT_SECRET as string) as userPlayLoad;
    const user=await addUserModel.findOne({email:decodedData.email});
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User not found",
        });
    }
    req.user=user;
    next();
}catch(error){
    next(error);
}
}



export const isAdminLoggedIn=async(req:authRequest,res:Response,next:NextFunction)=>{
    try{
        const token=req.cookies?.token;
        if(!token){
            return res.status(403).json({
                message:"token not found",
            });
        }
        const decodedData=jwt.verify(token,JWT_SECRET as string) as userPlayLoad;
        if(decodedData.role!='admin'){
            return res.status(403).json({
                message:"access denied",
            })
        }
        const user=await addUserModel.findOne({email:decodedData.email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user not found",
            });
        }
        req.user=user;
        next();
    }catch(error){
        next(error);
    }
}