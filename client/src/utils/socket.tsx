import { io,Socket } from "socket.io-client";
import { env } from "../configs/env.config";
interface customSocket extends Socket{
  hasJoined?:boolean;
}
export const socket:customSocket=io(`${env.backendurl}`,{
  autoConnect:false,  
})