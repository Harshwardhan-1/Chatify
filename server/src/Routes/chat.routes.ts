import {Router} from 'express';
export const userChat=Router();
import { isUserLoggedIn } from '../middleware/auth.middleware';
import { userPrevChat,showUserLastMessage } from '../Controllers/chat.controller';

userChat.post('/userPrevChat',isUserLoggedIn,userPrevChat);
userChat.post('/showLastMessage',isUserLoggedIn,showUserLastMessage);