  import {useState, useEffect } from "react";
  import { env } from "../../configs/env.config";
  import axios,{AxiosError} from "axios";
  import '../../styles/Dashboard.css';
  import { useNavigate } from "react-router-dom";
  export function Dashboard(){
    const navigate=useNavigate();
    interface userInfo{
      userId:string,
      name:string,
      userName:string,
      email:string,
      profilePic:string,
    }
  const [data,setData]=useState<userInfo[]>([]);
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
    })





  //getted all users that user previously talk
  interface Conversion{
    participants:string[], //senderId,recieverId hongi esma user ki
    lastMessage:string,
    createdAt:Date,
  }
  const [convo,setConvo]=useState<Conversion[]>([]);
    useEffect(()=>{
      const fetch=async()=>{
  try{
  const response=await axios.get(`${env.backendurl}/api/v1/lastMessage`,{withCredentials:true});
  if(response.data.message=== 'successfull'){
    setConvo(response.data.data);
  }
  }catch(err){
    const error=err as AxiosError;
    if(error.response && error.response.data){
      const data=error.response.data as {error:string;message:string};
      alert(data.error || data.message || 'something went wrong');
    }else{
      alert(error.message);
    }
  }
      };
      fetch();
    },[]);











  //currentUserid
  interface userId{
    currentUserId:string,
  }
  const [id,setId]=useState<userId>();
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




    const handleClick=async(all:userInfo)=>{
      navigate('/ChatPage',{state:{harsh:all}});
    }
      return (
        <>
      <div className="dashboard-container">
        <div className="sidebar">
          <div className="logo">Chatify</div>
          <input type="text" placeholder="Search or start new chat" className="search-bar" />
          <div className="user-list">
            {data.map((user,index)=>{
              const conversation=convo.find((c)=>
                c.participants.includes(id?.currentUserId || "") && c.participants.includes(user.userId));
              return(
                      <div key={index} className="user-item" onClick={() => handleClick(user)}>
                <div className="avatar">{user.userName[0]}</div>
                <div className="user-info">
                  <div className="user-name">{user.userName}</div>
                  <div className="last-message">{conversation?conversation.lastMessage:""}</div>
                </div>
              </div>
               );
           })}      
             </div>
    </div>
        <div className="chat-area">
          <div className="chat-placeholder">
            <div className="chat-icon">💬</div>
            <h2>Chatify</h2>
            <p>Select a chat to start messaging</p>
          </div>
        </div>
      </div>
      <h1>currentUserId:{id?.currentUserId}</h1>
      </>
    );
  }

