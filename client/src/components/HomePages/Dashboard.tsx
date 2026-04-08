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



    //show last message to user
interface UserId{
currentuserId:string,
}
const [id,setId]=useState<UserId>();
  useEffect(()=>{
    const fetch=async()=>{
      try{
      const response=await axios.get(`${env.backendurl}/api/v1/getcurrentUserId`,{withCredentials:true});
      if(response.data.message=== 'successfull'){
        setId(response.data.data);
        console.log(id?.currentuserId);
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
  }); 




  //one more useEffect
  useEffect(()=>{
    const fetch=async()=>{
try{
  const send={id:id?.currentuserId};
const response=await axios.post(`${env.backendurl}/api/v1/lastMessage`,send,{withCredentials:true});
if(response.data.message=== 'successfull'){
  alert('successfull');
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
  })

  //end of user current Id
  const handleClick=async(all:userInfo)=>{
    navigate('/ChatPage',{state:{harsh:all}});
  }
    return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">Chatify</div>
        <input type="text" placeholder="Search or start new chat" className="search-bar" />
        <div className="user-list">
          {data.map((user, index) => (
            <div key={index} className="user-item" onClick={() => handleClick(user)}>
              <div className="avatar">{user.userName[0]}</div>
              <div className="user-info">
                <div className="user-name">{user.userName}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-area">
        <div className="chat-placeholder">
          <div className="chat-icon">💬</div>
          <h2>Chatify</h2>
          <p>Select a chat to start messaging</p>
        </div>
      </div>
     {/* current userlogin id {id?.currentuserId}; */}
    </div>
  );
}

