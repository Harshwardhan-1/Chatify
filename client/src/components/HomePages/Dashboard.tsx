import {UserUseEffect} from '../../hooks/usechatUseEffect';
import '../../styles/Dashboard.css';
import { Lastmessageconvo } from '../../hooks/uselastMessage';
  import { useNavigate } from "react-router-dom";
  export function Dashboard(){
    const navigate=useNavigate();


    const {data,id}=UserUseEffect();
    interface userInfo{
      userId:string,
      name:string,
      userName:string,
      email:string,
      profilePic:string,
    }
    const handleClick=async(all:userInfo)=>{
      navigate('/ChatPage',{state:{harsh:all}});
    }
    const conversation=Lastmessageconvo();
    
      return (
        <>
      <div className="dashboard-container">
        <div className="sidebar">
          <div className="logo">Chatify</div>
          <input type="text" placeholder="Search or start new chat" className="search-bar" />
          <div className="user-list">
            {data.map((user,index)=>{
              const lastConversion=conversation.find((c)=>
              c.participants.includes(id?.currentUserId || "") && c.participants.includes(user.userId));
              return(
                   <div key={index} className="user-item" onClick={() => handleClick(user)}>
                <div className="avatar">{user.userName[0]}</div>
                <div className="user-info">
                  <div className="user-name">{user.userName}</div>
                  <div className="last-message">{lastConversion?lastConversion.message:""}</div>
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
      </>
    );
  }

