import {Router} from 'express';
export const userChat=Router();
import { isUserLoggedIn } from '../middleware/auth.middleware';
import { userPrevChat } from '../Controllers/chat.controller';

userChat.post('/userPrevChat',isUserLoggedIn,userPrevChat);