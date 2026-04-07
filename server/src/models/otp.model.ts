import mongoose from "mongoose";
import {Document,Types} from 'mongoose';
import { minLength,maxLength } from "zod";

export interface userOtpInterface extends Document{
    _id:Types.ObjectId,
        email?:string,
    otpValue?:Number,
    otpCreateTime?:Date,
    otpExpiresTime?:Date,
}


export const otpSchema=new mongoose.Schema<userOtpInterface>({
    email:{
        type:String,
        required:true,
        match : [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },
    otpValue:{
        type:Number,
        required:true,
    },
    otpCreateTime:{
        type:Date,
        default:Date.now,
    },
    otpExpiresTime:{
        type:Date,
        default:Date.now,
    },
});
    

export const checkOtpModel=mongoose.model<userOtpInterface>('sendotp',otpSchema);