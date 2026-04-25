import { useEffect } from "react";
import { socket } from "./utils/socket";
import { Routes,Route } from "react-router-dom"
import SignUp from "./components/auth/SignUp"
import Login from "./components/auth/login"
import OtpPage from "./components/auth/otpPage"
import { Dashboard } from "./components/HomePages/Dashboard"
import { ChatPage } from "./components/HomePages/ChatPage"

function App() {
useEffect(()=>{
  socket.connect();
})

  return (
    <>
      <Routes>
        <Route path="/" element={<SignUp />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path= '/OtpPage' element={<OtpPage />}></Route>
        <Route path="/Dashboard" element={<Dashboard />}></Route>
        <Route path="/ChatPage" element={<ChatPage />}></Route>
      </Routes>
    </>
  )
}

export default App
