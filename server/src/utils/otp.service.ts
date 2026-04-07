import { SENDGRID_API_KEY,SENDGRID_EMAIL } from '../configs/env.config';
import { checkOtpModel } from '../models/otp.model';
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(SENDGRID_API_KEY as string);

export const sendOtpService=async(email:string)=>{
try{
 const generateOtp=Math.floor(100000+Math.random()*900000);
    const putOtp=await checkOtpModel.findOne({email});
    if(!putOtp){
        const createOtpModel=await checkOtpModel.create({
            email,
            otpValue:generateOtp,
            otpCreateTime:new Date(Date.now()),
            otpExpiresTime:new Date(Date.now()+5*60*1000),
        });
    }else{
        putOtp.otpValue=generateOtp,
        putOtp.otpExpiresTime=new Date(Date.now()+5*60*1000);
        await putOtp.save();
    }

    await sgMail.send({
        to:email,
        from:SENDGRID_EMAIL as string,
            subject: "Your One-Time Password (OTP) for Secure Login",
            html: `<h2>Your OTP is: ${generateOtp}</h2>`
    });
}catch(error){
    console.log(error);
    throw error;
}
}