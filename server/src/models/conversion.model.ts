import mongoose from 'mongoose';
import {Document,Types} from 'mongoose';

export interface IConversion extends Document{
    participants:Types.ObjectId[],
    lastMessage:string,
    createdAt:Date,
}



export const conversionSchema=new mongoose.Schema<IConversion>({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"addUser",
        required:true,
    }],
    lastMessage:{
        type:String, 
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
},{
    timestamps:true,
})




export const conversionModel=mongoose.model<IConversion>('conversion',conversionSchema);