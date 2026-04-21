import { socket } from "../utils/socket";
import {useEffect,useState} from 'react';
import { useLocation } from "react-router-dom";
import { UserOldMessage } from "./userPrevChat";
interface Message{
    senderId:string,
    receiverId:string,
    message:string,
}
interface Data{
    message:string,
    error:string,
}

interface Status{
    userId:string,
    message:string,
}



export const useChatSocket=(currentUserId:string | undefined)=>{
    const location=useLocation();
    const data=location?.state?.harsh;
    const [messages,setMessages]=useState<Message[]>([]);
    const [error,setError]=useState<Data | null>(null);
    const [status,setStatus]=useState<Status | null>(null);
    const prevMessage=UserOldMessage(currentUserId,data?.userId);
    

    const handleError=(data:Data)=>{
        setError(data);
        setTimeout(()=>{
            setError(null);
        },3000);
    }

    const handleStatus=(statusData: Status)=>{
  if (statusData.userId===data?.userId){
    setStatus(statusData);
  }
};

    useEffect(()=>{
        if(!currentUserId){
            return;
        }
    socket.connect();
    socket.emit('join',currentUserId);
    socket.on('receive-message',(data:Message)=>{
    setMessages(prev => [...prev, { senderId: data.senderId, receiverId: data?.receiverId || data.senderId, message: data.message }]);
    });
    socket.on("chat-error",handleError);
    socket.on("user_status",handleStatus);

    socket.on("all_online_users", (onlineUsers: string[]) => {
  if (onlineUsers.includes(data?.userId)) {
    setStatus({ userId: data.userId, message: "online" });
  } else {
    setStatus({ userId: data.userId, message: "offline" });
  }
});
    return()=>{
        socket.off('receive-message');
        socket.off('chat-error');
        socket.off('all_online_users');
        socket.off('user_status');
        socket.disconnect();
    }
},[currentUserId,data?.receiverId,data?.userId]);
const allmessages=[...prevMessage,...messages];
    const sendMessage = (data: { senderId:string;receiverId:string;message:string})=>{
        if(!data.senderId || !data.receiverId){
        return;
        }
    socket.emit("send_message", data);
  };
  return { messages:allmessages, sendMessage,error,status };
};