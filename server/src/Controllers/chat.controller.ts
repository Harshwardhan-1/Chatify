import { chatModel } from '../models/chat.model';
import {Request,Response,NextFunction} from 'express';
import { lastMessageModel } from '../models/conversion.model';
import { handleConversion } from './lastmessage.controller';

//for text messages only not for file now i will build diffrent function for this that will handle file
//using multer disk storage
interface SocketData{
    senderId:string,
    receiverId:string,
    message:string,
    messageType?:"text" | "image" | "video" | "url",
}
export const saveUserChats=async(data:SocketData)=>{
try{
    const senderId=data.senderId;
    const receiverId=data.receiverId;
    const message=data.message;
    const messageType=data.messageType || "text";
    await handleConversion(senderId,receiverId,message);
    const createChat=await chatModel.create({
        senderId,
        receiverId,
        message,
        messageType,
        isSeen:false,
        isDelieverd:false,
        isPopUp:false,
    });
    return createChat;
}catch(err){
console.log(err);
throw err;
}
}











export const userPrevChat=async(req:Request,res:Response,next:NextFunction)=>{
try{
const {senderId,receiverId}=req.body;
if(!senderId || !receiverId){
    return res.status(400).json({
        success:false,
        message:"something went wrong",
    });
}
const allMessages=await chatModel.find({
    $or:[
        {senderId:senderId,receiverId:receiverId},
        {senderId:receiverId,receiverId:senderId},
    ]
}).sort({createdAt:1});
return res.status(200).json({
    success:true,
    message:"successfull",
    data:allMessages,
})
}catch(err){
    next(err);
}
} 