import { socket } from "../utils/socket";
import {useEffect,useState} from 'react';
import { useLocation } from "react-router-dom";
import { UserOldMessage } from "./userPrevChat";
interface Message{
    senderId:string,
    receiverId:string,
    message:string,
    createdAt:Date,
}
interface Data{
    message:string,
    error:string,
}






export const useChatSocket=(currentUserId:string | undefined)=>{
    const location=useLocation();
    const data=location?.state?.harsh;
    const [messages,setMessages]=useState<Message[]>([]);
    const [error,setError]=useState<Data | null>(null);
    const [onlineUsers,setOnlineUsers]=useState<string[]>([]);
    const prevMessage=UserOldMessage(currentUserId,data?.userId);
    

    const handleError=(data:Data)=>{
        setError(data);
        setTimeout(()=>{
            setError(null);
        },3000);
    }

    const handleStatus=(users:string[])=>{
        setOnlineUsers(users);
    }
  

    useEffect(()=>{
        if(!currentUserId){
            return;
        }
    socket.on('receive-message',(data:Message)=>{
    setMessages(prev => [...prev, { senderId: data.senderId, receiverId: data?.receiverId || data.senderId, message: data.message,createdAt:data.createdAt }]);
    });
    socket.on("chat-error",handleError);
    socket.on("user_status",handleStatus);
    socket.emit('get_users');
    return()=>{
        socket.off('receive-message');
        socket.off('chat-error');
        socket.off('user_status');
    }
},[currentUserId,data?.receiverId,data?.userId]);
const allmessages=[...prevMessage,...messages];
const isReceiverOnline=onlineUsers.includes(data?.userId);

    const sendMessage = (data: { senderId:string;receiverId:string;message:string})=>{
        if(!data.senderId || !data.receiverId){
        return;
        }
    socket.emit("send_message", data);
  };
  return { messages:allmessages, sendMessage,error,isReceiverOnline };
};