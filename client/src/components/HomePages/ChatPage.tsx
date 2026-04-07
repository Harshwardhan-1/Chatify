import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { env } from "../../configs/env.config";
import { useChatSocket } from "../../hooks/userChatSocket";
import '../../styles/ChatPage.css';

interface currUser{
    _id:string,
    email:string,
}


export function ChatPage() {
  const [msg, setMsg] = useState('');
  const [currentUserData, setCurrentUserData] = useState<currUser>();
  const location = useLocation();
  const data = location?.state?.harsh;


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


  const { messages, sendMessage } = useChatSocket(currentUserData?._id);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!currentUserData?._id || !data?.userId ){
        return;
    }
    if (!msg.trim()) return alert("Input field is empty");
    sendMessage({ senderId: currentUserData?._id, receiverId: data?.userId, message: msg });
    setMsg('');
  };
     
  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src="defaultImage.avif" alt="Profile" />
        <h4>{data?.userName}</h4>
      </div>
      
            <div className="message receiver">jisko message bhejna ha uski id:{data?.userId}</div>
            <div className="message receiver">jisko message bhejna ha uski email:{data?.email}</div>
            <div className="message sender">ya ha currentUserId:jo message karenga uski id :{currentUserData?._id}</div>
            <div className="message sender">jo message karenga uski id :{currentUserData?.email}
            </div>
      <div className="chat-messages">
        {messages.map((msgItem, index) => (
    <div key={index} className={`message ${msgItem.senderId === currentUserData?._id ? 'sender' : 'receiver'}`}>
      {msgItem.message}
    </div>
))}
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type Your Message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}