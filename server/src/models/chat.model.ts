import mongoose from 'mongoose';
import {Document,Types} from 'mongoose';


export interface IChatSchema extends Document{
    senderId:string,
    receiverId:string,
    message:string,
    messageType:"text" | "image" | "file" | "video",
    isSeen:boolean,
    isDelieverd:boolean,
    isPopUp:boolean,
    fileUrl?:string,
    createdAt:Date,
    updatedAt:Date,
}



export const ChatSchema=new mongoose.Schema<IChatSchema>({
    senderId:{
        type:String,
        ref:"addUser",
        required:[true,'sender id is required'],
    },
    receiverId:{
        type:String,
        ref:'addUser',
        required:[true,'reciever id is required'],
    },
    message:{
        type:String,
        required:[true,'message field cannot be empty'],
    },
    messageType:{
        type:String,
        enum:["text","video","image","file"],
        required:[true,'message field is required'],
        default:"text",
    },
    isSeen:{
        type:Boolean,
        default:false,
    },
    isDelieverd:{
        type:Boolean,
        default:false,
    },
    isPopUp:{
        type:Boolean,
        default:false,
    },
    fileUrl:{
        type:String,
    },
},{
    timestamps:true,
})



export const chatModel=mongoose.model<IChatSchema>('userChat',ChatSchema);