import {Request,Response,NextFunction} from 'express';
import { addUserModel } from '../models/userModel';
import { checkOtpModel } from '../models/otp.model';
import { userSchema,userLoginSchema, } from '../validation/userValidation';
import { checkUserOtpSchema } from '../validation/checkotp.validation';
import { sendOtpService } from '../utils/otp.service';
import bcrypt from 'bcrypt';
import { SALT_ROUND,JWT_SECRET,SENDGRID_API_KEY ,SENDGRID_EMAIL} from '../configs/env.config';
import jwt from 'jsonwebtoken';
import { authRequest } from '../types/authRequest.type';

export const addUser=async(req:Request,res:Response,next:NextFunction)=>{
   try{ 
      const parsed=userSchema.safeParse(req.body);
      if(!parsed.success){
         const issue=parsed.error.issues[0];
         return res.status(400).json({
            success:false,
            message:issue.message,
         })
      }
      const {userName,name,email,password}=parsed.data;
      const checkUserExist=await addUserModel.findOne({email});
      if(checkUserExist){
         return res.status(409).json({
            success:false,
            message:"user already exist",
         });
      }
      const salt=await bcrypt.genSalt(Number(SALT_ROUND));
      const hashPassword=await bcrypt.hash(password,salt);
       const createUser=await addUserModel.create({
         name,
         userName,
         email,
         password:hashPassword,
         role:"user",
       });
       if(!createUser){
         return res.status(400).json({
            message:"error creating user",
         });
       }
      const token=jwt.sign({email:email,userId:createUser._id,role:createUser.role},JWT_SECRET as string);
      res.cookie('token',token,{
         httpOnly:true,
         sameSite:"lax",
         secure:false,
         maxAge:7*24*60*60*1000
      });
      return res.status(201).json({
         success:true,
         message:"user created successfully",
});
   }catch(err){
      next(err);
   }
}













export const oldUsers=async(req:Request,res:Response,next:NextFunction)=>{
   try{
      const parsed=userLoginSchema.safeParse(req.body);
      if(!parsed.success){
            const issue=parsed.error.issues[0];
         return res.status(400).json({
            success:false,
            message:issue.message,
         });
      }
      const {email,password}=parsed.data;
      const oldUser=await addUserModel.findOne({email});
      if(!oldUser){
         return res.status(400).json({
            message:"user not exist",
         });
      }
      const hashedPassword=oldUser.password;
      if(!hashedPassword){
         return res.status(400).json({
            success:false,
            message:"password is required",
         });
      }
      const compare=await bcrypt.compare(password,hashedPassword);
      if(!compare){
         return res.status(400).json({
            success:false,
            message:"password doesn't match",
         });
      }

      const token=jwt.sign({userId:oldUser._id,email:oldUser.email,role:oldUser.role},JWT_SECRET as string); 
      res.cookie("token",token,{
         httpOnly:true,
         sameSite:"lax",
         secure:false,
         maxAge:7*24*60*60*1000,
      });
      return res.status(200).json({
         success:true,
         message:"successfully found user",
      });   
   }catch(error){
      next(error);
   }
}















export const recieveOtp=async(req:Request,res:Response,next:NextFunction)=>{
   try{
const user=(req as any).user;
const userId=user.userId;
const email=user.email;
const parsed=checkUserOtpSchema.safeParse(req.body);
if(!parsed.success){
   const issue=parsed.error.issues[0];
   return res.status(400).json({
      success:false,
      message:issue.message,
   });
}
const {otpnumber}=parsed.data;
const record=await checkOtpModel.findOne({email});

if(!record){
   return res.status(400).json({
      message:"no record found",
   });
}
if(!record.otpExpiresTime || Date.now()>record.otpExpiresTime.getTime()){
   return res.status(400).json({
      success:false,
      message:"otp expired",
   });
}

   if(record.otpValue!==Number(otpnumber)){
      return res.status(400).json({
      success:false,
      message:"invalid otp",
   });
   }
   return res.status(200).json({
      success:true,
      message:"otp verified successfull",
   })
   }catch(error){
      next(error);
   }
}








export const resendOtp=async(req:authRequest,res:Response,next:NextFunction)=>{
try{
   const user=req.user;
   const email=user?.email;
   if(!email){
      return res.status(400).json({
         success:false,
         message:"email not found in record",
      });
   }
   const checkIt=await checkOtpModel.findOne({email});
   if(!checkIt){
      return res.status(401).json({
         success:false,
         message:"email not found",
      });
   }
   try{
      await sendOtpService(email);
      return res.status(200).json({
         success:true,
         message:"otp send successfully",
      });
   }catch(err){
      next(err);
   }
}catch(err){
   next(err);
}
}









export const me=async(req:authRequest,res:Response,next:NextFunction)=>{
   return res.status(200).json({
      success:true,
      message:"have cookie",
      data:req.user,
   });
}






export const logout=async(req:Request,res:Response,next:NextFunction)=>{
try{
   const token=req.cookies.token;
   if(!token){
      return res.status(401).json({
         success:false,
         message:"cookie not found",
      })
   }
   res.clearCookie('token');
   return res.status(200).json({
      success:true,
      message:"successfully logout",
   });
}catch(err){
   next(err);
}
}










export const userInfo=async(req:authRequest,res:Response,next:NextFunction)=>{
   try{
      const user=req.user;
      const currentUserEmail=user?.email;
      const allUser=await addUserModel.find({email:{$ne:currentUserEmail}}).select("-password");
      if(allUser.length===0){
         return res.status(400).json({
            success:false,
            message:"no one to talk",
         })
      }
      const userData=allUser.map(user=>({
         userId:user._id,
         name:user.name,
         userName:user.userName,
         email:user.email,
      }))
      return res.status(200).json({
         success:true,
         message:"successfull",
         data:userData,
      })
   }catch(err){
      next(err);
   }
}





export const currentUser=async(req:authRequest,res:Response,next:NextFunction)=>{
   try{
      const user=req.user;
      const email=user?.email;
      const checkUser=await addUserModel.findOne({email}).select("-password");
      if(!checkUser){
         return res.status(401).json({
            success:false,
            message:"user you are want to talk does not found",
         });
      }
      return res.status(200).json({
         success:true,
         message:"successfull",
         data:checkUser,
      });
   }catch(err){
      next(err);
   }
}










export const getCurrentUserId=async(req:authRequest,res:Response,next:NextFunction)=>{
   try{
      const user=req.user;
      const userId=user?._id;
      if(!userId){
         return res.status(401).json({
            success:false,
            message:"user Id not found",
         });
      }
      return res.status(200).json({
         success:true,
         message:"successfull",
         data:{
            currentuserId:userId,
         }
      })
   }catch(err){
      next(err);
   }
}