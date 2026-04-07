import { useState } from "react";
import axios, { AxiosError } from "axios";
import { env } from "../../configs/env.config";
import { useNavigate } from "react-router-dom";
import '../../styles/otpPage.css';
import Swal from "sweetalert2";

export default function OtpPage(){
    const navigate=useNavigate();
    const [otpnumber,setotpnumber]=useState<string>('');
    const [loading,setLoading]=useState<boolean>(false);
    const [isBlurred,setIsBlurred]=useState<boolean>(false);
    const [resendLoad,setResendLoad]=useState<boolean>(false);

    

    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setIsBlurred(true);
        const send={otpnumber};
        setLoading(true);
        try{
            const response=await axios.post(`${env.backendurl}/api/v1/checkOtp`,send,{withCredentials:true});
            if(response.data.message=== 'otp verified successfull'){
              await Swal.fire({
                icon:"success",
                title:"Otp Verification",
                text:"Otp Verified Successfully",
                 showConfirmButton: true,
                 background: "#0b1b2b",
                 color: "#e2e8f0",
               })
                setIsBlurred(false);
                navigate('/Dashboard');
            }
        }catch(err){
            const error=err as AxiosError;
            if(error.response && error.response.data){
                const data=error.response.data as {error?:string;message?:string};
                alert(data.error || data.message || 'something went wrong');
            }else{
                alert(error.message);
            }
        }finally{
            setLoading(false);
            setIsBlurred(false);
        }
    }

    const handleResend=async(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        setResendLoad(true);
        try{
            const response=await axios.get(`${env.backendurl}/api/v1/resend`,{withCredentials:true});
            if(response.data.message=== 'otp send successfully'){
                alert('otp send to your email successfully');
            }
        }catch(err){
        const error=err as AxiosError;
        if(error.response && error.response.data){
            const data=error.response.data as {error:string;message:string};
            alert(data.error || data.message || 'soemthing went wrong');
        }else{
            alert(error.message);
        }
    }finally{
        setResendLoad(false);
    }
    }
    return(
        <>
         <div className={`otp-page-wrapper ${isBlurred?"blurred":""}`}>
      <div className="otp-page">
        <h1>Verify OTP</h1>
        <p>Enter the 6-digit OTP sent to your email</p>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter your 6 digit otp here" value={otpnumber} onChange={(e)=>setotpnumber(e.target.value)} />
            <button type="submit">
                {loading? <div className="spinner"></div> :"Submit"}
            </button>
             <button onClick={handleResend} disabled={resendLoad}>
                {resendLoad?<div className="spinner"></div>:"resend"}
                </button>
        </form>
        </div>
        </div>
        </>
    );
}