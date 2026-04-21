import {useState} from 'react';
import { useEffect } from 'react';
import { env } from '../configs/env.config';
import axios,{AxiosError} from 'axios';


interface userInfo{
      userId:string,
      name:string,
      userName:string,
      email:string,
      profilePic:string,
    }

 

  interface userId{
    currentUserId:string,
  }
export const UserUseEffect=()=>{
 const [data,setData]=useState<userInfo[]>([]);
   const [id,setId]=useState<userId>();

    useEffect(()=>{
      const fetch=async()=>{
        try{
          const response=await axios.get(`${env.backendurl}/api/v1/userInfo`,{withCredentials:true});
          if(response.data.message=== 'successfull'){
            setData(response.data.data);
          }
        }catch(err){
          const error=err as AxiosError;
          if(error.response && error.response.data){
            const data=error.response.data as {error:string;message:string};
            alert(data.error || data.message || 'somethig went wrong');
          }else{
            alert(error.message);
          }
        }
      };
      fetch();
    },[]);

    
     useEffect(()=>{
    const fetch=async()=>{
      try{
        const response=await axios.get(`${env.backendurl}/api/v1/getCurrentUserId`,{withCredentials:true});
        if(response.data.message=== 'successfull'){
          setId(response.data.data);
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
  },[])

  return {data,id};
}