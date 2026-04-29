import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useChatSocket } from "../../hooks/userChatSocket";
import '../../styles/ChatPage.css';
import { useCurrentUser } from "../../hooks/useCurrentUser";


export function ChatPage() {
  const [msg, setMsg] = useState('');
  // const [file,setFile]=useState<File |null>(null);
  const location = useLocation();
  const data = location?.state?.harsh;
  const currentUserData=useCurrentUser();


  const { messages, sendMessage,error,isReceiverOnline,lastVisit} = useChatSocket(currentUserData?._id);


  const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
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
        {error && (<div className="error-box">{error.message}</div>)}
        <img src="defaultImage.avif" alt="Profile" />
        <p>
        {data?.userName}{" "}
        {isReceiverOnline ? "🟢 Online" : lastVisit?`Last seen at ${new Date(lastVisit.lastSeen).toLocaleString()}`:"offline"}
      </p>
      </div>

            <div className="message receiver">jisko message bhejna ha uski id:{data?.userId}</div>
            <div className="message receiver">jisko message bhejna ha uski email:{data?.email}</div>
            <div className="message sender">ya ha currentUserId:jo message karenga uski id :{currentUserData?._id}</div>
            <div className="message sender">jo message karenga uski id :{currentUserData?.email} </div>

      <div className="chat-messages">
        {messages.map((msgItem, index) => (
    <div key={index} className={`message ${msgItem.senderId === currentUserData?._id ? 'sender' : 'receiver'}`}>
      {msgItem.message}
      {new Date(msgItem.createdAt).toLocaleTimeString([],{  hour:'2-digit',minute:'2-digit',hour12:true,})}
    </div>
))}
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type Your Message" />
        {/* <input type="file"  onChange={(e)=>{ if(e.target.files && e.target.files[0]){setFile(e.target.files[0]);}}} /> */}
        <button type="submit">Send</button>
      </form>
    </div>
  );
}