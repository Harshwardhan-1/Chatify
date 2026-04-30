import {Router} from 'express';
export const userChat=Router();
import { isUserLoggedIn } from '../middleware/auth.middleware';
import { userPrevChat } from '../Controllers/chat.controller';
import { upload } from '../middleware/userFile.middleware';
import { userFile } from '../Controllers/chat.controller';

userChat.post('/userPrevChat',isUserLoggedIn,userPrevChat);
userChat.post("/file",isUserLoggedIn,upload.single("file"),userFile);