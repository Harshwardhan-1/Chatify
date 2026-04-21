import axios,{AxiosError} from "axios";
import {useState, useEffect } from "react";
import { env } from "../configs/env.config";

interface userPrevMessage{
    senderId:string,
    receiverId:string,
    message:string,
}

export const UserOldMessage=(currentUserId:string | undefined,receiverId:string | undefined)=>{
   const [prevMessage,setprevMessage]=useState<userPrevMessage[]>([]);
    useEffect(()=>{
        if(!currentUserId || !receiverId){
            return;
        }
        const fetch=async()=>{
            const send={senderId:currentUserId,receiverId};
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
                    alert(err);
                }
            }
        };
        fetch();
    },[currentUserId,receiverId]);
    return prevMessage;
}