import axios,{AxiosError} from "axios";
import { env } from "../configs/env.config";
import {useState,useEffect} from 'react';
interface convo{
      participants:string[],
      message:string,
    }
export const Lastmessageconvo=()=>{
    const [conversation,setConversation]=useState<convo[]>([]);
    useEffect(()=>{
      const fetch=async()=>{
        try{
          const response=await axios.get(`${env.backendurl}/api/v1/userAllConversion`,{withCredentials:true});
          if(response.data.message=== 'all conversion'){
            setConversation(response.data.data);
          }
        }catch(err){
          const error=err as AxiosError;
          if(error.response && error.response.data){
            const data=error.response.data as {error:string;message:string};
            alert(data.message || data.error || 'something went wrong');
          }else{
            alert(error.message);
          }
        }
      };
      fetch();
    },[]);
    return conversation;
}