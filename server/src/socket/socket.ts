import { Server } from "socket.io";
import { Server as httpServer } from 'http';
import { saveUserChats } from "../Controllers/chat.controller";
export const usersChat=(server:httpServer,FRONTEND_URL?:string)=>{
    const io=new Server(server,{
        cors:{
          origin:FRONTEND_URL,
          methods:["GET","POST","DELETE","UPDATE"],
          credentials:true,
        }
      });
      
      const users:{[key:string]:string}={};
      
      io.on('connection',(socket)=>{
        console.log('connected',socket.id);
        socket.on("join",(userId:string)=>{
          users[userId]=socket.id;
          console.log('Joined',userId);
        })
        socket.on('send_message',async(data)=>{
          try{
          const savedMessage=await saveUserChats(data);
          const receiverSocketId=users[data.receiverId];
          if(receiverSocketId){
            io.to(receiverSocketId).emit('receive-message',savedMessage); //es data ma senderId,receiverId,message
          }
          socket.emit('receive-message',savedMessage);
        }catch(error){
          const errMsg=error instanceof Error ? error.message :"Unknown Error";
          socket.emit("error",{
            message:"Message send failed",
            error:errMsg,
          });
        }
        });
        socket.on('disconnect',()=>{
          console.log('disconnect');
          for (const id in users) {
          if (users[id] === socket.id) {
            delete users[id];
            break;
          }
        }
        })
      })
}