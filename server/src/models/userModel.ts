import mongoose from "mongoose";
import { minLength,maxLength } from "zod";
import { Document,Types } from "mongoose";


export interface UserInterface extends Document{
    _id:Types.ObjectId;
    name?:string,
    userName?:string,
    email?:string,
    profilepic?:string,
    password?:string,
    role?:string,
    createdAt?:Date,
}
export const addUserSchema=new mongoose.Schema<UserInterface>({
    name:{
        type:String,
        required:[true,'name is required'],
        minLength:3,
        maxLength:20,
    },
    userName:{
        type:String,
        required:[true,'userName is required'],
        minLength:3,
        maxLength:20,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
        match : [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minLength:[3,"password must be atleast of 3 characters"],
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },
    profilepic:{
        type:String,
        default:"/uploads/defaultImage.avif",
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
},{
    timestamps:true, 
})


export const addUserModel=mongoose.model<UserInterface>('addUser',addUserSchema);