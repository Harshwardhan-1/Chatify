import { io } from "socket.io-client";
import { env } from "../configs/env.config";
export const socket=io(`${env.backendurl}`,{
  autoConnect:false,  
})