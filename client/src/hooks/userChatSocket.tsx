import { socket } from "../utils/socket";
import {useEffect,useState} from 'react';
import axios,{AxiosError} from 'axios';
import { env } from "../configs/env.config";
import { useLocation } from "react-router-dom";
interface Message{
    senderId:string,
    receiverId:string,
    message:string,
}
interface userPrevMessage{
    senderId:string,
    receiverId:string,
    message:string,
}
export const useChatSocket=(currentUserId:string | undefined)=>{
    const location=useLocation();
    const data=location?.state?.harsh;
    const [messages,setMessages]=useState<Message[]>([]);
    const [prevMessage,setprevMessage]=useState<userPrevMessage[]>([]);
    useEffect(()=>{
        if(!currentUserId || !data?.userId){
            return;
        }
        const fetch=async()=>{
            const send={senderId:currentUserId,receiverId:data?.userId};
            try{
                const response=await axios.post(`${env.backendurl}/api/v1/userPrevChat`,send,{withCredentials:true});
                if(response.data.message=== 'successfull'){
                     setprevMessage(response.data.data);
                }
            }catch(err){
                const error=err as AxiosError;
                if(error.response && error.response.data){
                    const data=error.response.data as {error:string;message:string};
                    alert(data.message || data.error || 'something went wrong');
                }else{
                    alert(data.error);
                }
            }
        };
        fetch();
    },[currentUserId,data]);   

    useEffect(()=>{
        if(!currentUserId){
            return;
        }
    socket.connect();
    socket.emit('join',currentUserId);
    socket.on('receive-message',(data:Message)=>{
    setMessages(prev => [...prev, { senderId: data.senderId, receiverId: data?.receiverId || data.senderId, message: data.message }]);
    });
    return()=>{
        socket.off('receive-message');
        socket.disconnect();
    }
},[currentUserId]);


const allmessages=[...prevMessage,...messages];

    const sendMessage = (data: { senderId: string; receiverId: string; message: string }) => {
        if(!data.senderId || !data.receiverId){
        return;
        }
    socket.emit("send_message", data);
  };
  return { messages:allmessages, sendMessage };
};