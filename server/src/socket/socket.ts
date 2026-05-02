import { Server } from "socket.io";
import { Server as httpServer } from 'http';
import { saveUserChats } from "../Controllers/chat.controller";
import { userPresence } from "../Controllers/userPresence.controller";
import { userPresenceModel } from "../models/userPresence.model";
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
          io.emit("user_status",Object.keys(users));
          console.log('Joined',userId);
        })
    socket.on("get_users", () => {
    socket.emit("user_status", Object.keys(users));
  });
   socket.on("user_last_visit",async(userId)=>{
      const findIt=await userPresenceModel.findOne({userId});
      if(findIt){
        socket.emit("user_last_visit_data",{
          userId,
          lastSeen:findIt.lastSeen,
        })
      }    
    })

    socket.on("user_typing",({senderId,receiverId})=>{
      const receiverSocketId=users[receiverId];
      if(receiverSocketId){
        io.to(receiverSocketId).emit("user_typing_something",{
          message:"typing",
          senderId,
        })
      }
    })
    
    socket.on("stop_typing",({senderId,receiverId})=>{
      const receiverSocketId=users[receiverId];
      if(receiverSocketId){
        io.to(receiverSocketId).emit("user_stopped_typing",{senderId});
      }
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
          socket.emit("chat-error",{
            message:"Message send failed",
            error:errMsg,
          });
        }
        });

        socket.on('disconnect',async()=>{
          let disconnectUserId="";
          console.log('disconnect');
          for (const id in users) {
          if (users[id] === socket.id) {
            disconnectUserId=id;
            const userlastvisit=await userPresence(id);
            io.emit("user_last_visit_data",{
              userId:id,
              lastSeen:userlastvisit,
            })
            delete users[id];
            break;
             }
          }
          if(disconnectUserId){
            io.emit("user_status",Object.keys(users));
          }
        })
      })
}