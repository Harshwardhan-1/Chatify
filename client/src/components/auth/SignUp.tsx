import { useState } from "react";
import { env } from "../../configs/env.config";
import axios, { AxiosError } from 'axios';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../../styles/SignUp.css';
export default function SignUp(){
    const navigate=useNavigate();
    const [name,setName]=useState<string>('');
    const [userName,setuserName]=useState<string>('');
    const [email,setEmail]=useState<string>('');
    const [password,setPassword]=useState<string>('');
    const [confirmPassword,setConfirmPassword]=useState<string>('');
    const [loading,setLoading]=useState<boolean>(false);
    


    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(password!==confirmPassword){
            alert('password and confirm password does not match');
            return 
        }
        setLoading(true);
        try{
            const send={name,userName,email,password}
            const response=await axios.post(`${env.backendurl}/api/v1/addUser`,send,{withCredentials:true});
            if(response.data.message=== 'user created successfully'){
                alert('successfully signedUp');
                navigate('/login');
            }
        }catch(err){
            const error=err as AxiosError;
            if(error.response && error.response.data){
                const data=error.response.data as {error?:string; message?:string};
                alert(data.error || data.message || 'something went wrong');
            }else{
                alert(error.message);
            }
        }finally{
            setLoading(false);
        }
    }
return(
    <>
     <div className="signup-page-wrapper">
          <div className="signup-page">
        <h1>Create an Account</h1>
        <p>Get Started with us</p>
        <form onSubmit={handleSubmit}>
               <label>Name</label>
          <input type="text" placeholder='Enter your Name' value={name} onChange={(e)=>setName(e.target.value)} />
                    <label>Username</label>
          <input type="text" placeholder='Enter your username' value={userName} onChange={(e)=>setuserName(e.target.value)} />
          <label>Email</label>
          <input type="email" placeholder='Enter your email ' value={email} onChange={(e)=>setEmail(e.target.value)}  />
         <label>password</label>
          <input type="password" placeholder='Create a password' value={password} onChange={(e)=>setPassword(e.target.value)} />
          <label>Confirm Password</label>
          <input type="password"  placeholder='Confirm Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
         
         
          <button 
          type='submit'>
            {loading ? <div className="spinner"></div>:"SignUp" }
          </button>



          <div className="signin-link">
    Already have an account?{" "}
    <Link to="/login">Login</Link>
  </div>
        </form>
        </div>
        </div>
        </>
);
}