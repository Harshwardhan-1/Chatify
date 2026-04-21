import axios from "axios";
import { useState,useEffect } from "react";
import { env } from "../configs/env.config";
export const useCurrentUser=()=>{
interface currUser{
    _id:string,
    email:string,
}
//current User Id 
const [currentUserData, setCurrentUserData] = useState<currUser>();    
    useEffect(() => {
    const fetch= async () => {
      try {
        const res = await axios.get(`${env.backendurl}/api/v1/currentUser`, { withCredentials: true });
        if (res.data.message === 'successfull') {
            setCurrentUserData(res.data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, []);
  return currentUserData;
}