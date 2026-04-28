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


interface lastSeen{
    userId:string,
    lastSeen:Date,
}






export const useChatSocket=(currentUserId:string | undefined)=>{
    const location=useLocation();
    const data=location?.state?.harsh;
    const [messages,setMessages]=useState<Message[]>([]);
    const [error,setError]=useState<Data | null>(null);
    const [onlineUsers,setOnlineUsers]=useState<string[]>([]);
    const [lastVisit,setLastVisit]=useState<lastSeen |null>(null);
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
    const handlelastvisit=(lastvisit:lastSeen)=>{
        setLastVisit(lastvisit);
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
    socket.emit('user_last_visit',data?.userId);
    socket.on("user_last_visit_data",handlelastvisit);
    return()=>{
        socket.off('receive-message');
        socket.off('chat-error');
        socket.off('user_status');
        socket.off('user_last_visit_data');
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
  return { messages:allmessages, sendMessage,error,isReceiverOnline,lastVisit };
};