import mongoose from 'mongoose';
import {Document,Types} from 'mongoose';

export interface IUserPresence extends Document{
    userId:string,
    lastSeen:Date,
}


export const userPresenceSchema=new mongoose.Schema<IUserPresence>({
    userId:{
        type:String,
        required:[true,'cannot be empty'],
    },
    lastSeen:{
        type:Date,
        required:[true,'cannot be empty'],
    }
},{
    timestamps:true,
})


export const userPresenceModel=mongoose.model<IUserPresence>('userPresence',userPresenceSchema);