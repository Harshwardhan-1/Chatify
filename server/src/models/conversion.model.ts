import mongoose from 'mongoose';
import {Document,Types} from 'mongoose';

export interface IlastMessageInterface extends Document{
    participants:mongoose.Types.ObjectId[],
    message:string,
    createdAt:Date,
    updatedAt:Date,
}


export const lastMessageSchema=new mongoose.Schema<IlastMessageInterface>({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"addUser",
        required:true,
    }],
    message:{
        type:String,
        required:[true,"message field is required"],
    }
},{
    timestamps:true
})


export const lastMessageModel=mongoose.model<IlastMessageInterface>("lastMessage",lastMessageSchema);